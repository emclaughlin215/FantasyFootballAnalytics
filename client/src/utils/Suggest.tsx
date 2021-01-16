import { MenuItem } from '@blueprintjs/core';
import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import React from 'react';

import { IDisplayPlayer, IPlayer, IPlayerType, ITeam } from '../index.d';
import { capitaliseSentence } from './String';

export const renderPlayerTypeInputValue = (player: IPlayerType) => player.plural_name;
export const renderPlayerInputValue = (player: IPlayer | IDisplayPlayer) => player.first_name + ' ' + player.second_name;
export const renderTeamInputValue = (team: ITeam) => team.name;
export const renderPropertyInputValue = (property: string) => capitaliseSentence(property.toString(), '_');

export const renderPlayerType: ItemRenderer<IPlayerType> = (team, { handleClick, modifiers, query}) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  const text = `${team.plural_name}`;
  return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={team.id}
        onClick={handleClick}
        text={highlightText(text, query)}
    />
  );
};

export const renderPlayer: ItemRenderer<IPlayer | IDisplayPlayer> = (player, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  const text = `${player.second_name}, ${player.first_name} (${player.element_name})`;
  return (
      <MenuItem 
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={player.id}
        onClick={handleClick}
        text={highlightText(text, query)}
    />
  );
};

export const renderTeam: ItemRenderer<ITeam> = (team, { handleClick, modifiers, query}) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  const text = `${team.name}`;
  return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={team.id}
        onClick={handleClick}
        text={highlightText(text, query)}
    />
  );
};

export const renderProperty: ItemRenderer<string> = (property, { handleClick, modifiers, query}) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  const text = `${capitaliseSentence(property.toString(), '_')}`;
  return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={property}
        onClick={handleClick}
        text={highlightText(text, query)}
    />
  );
};

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}

function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(escapeRegExpChars);
  if (words.length === 0) {
      return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens: React.ReactNode[] = [];
  while (true) {
      const match = regexp.exec(text);
      if (!match) {
          break;
      }
      const length = match[0].length;
      const before = text.slice(lastIndex, regexp.lastIndex - length);
      if (before.length > 0) {
          tokens.push(before);
      }
      lastIndex = regexp.lastIndex;
      tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
      tokens.push(rest);
  }
  return tokens;
}

export const filterPlayerType: ItemPredicate<IPlayerType> = (query, playerType, _index, exactMatch) => {
  const normalizedName = playerType.plural_name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
      return normalizedName === normalizedQuery;
  } else {
      return `${normalizedName}`.indexOf(normalizedQuery) >= 0;
  }
};

export const filterPlayer: ItemPredicate<IPlayer | IDisplayPlayer> = (query, player, _index, exactMatch) => {
  const normalizedName = player.first_name.toLowerCase() + ' ' + player.second_name.toLowerCase() + ' (' + player.element_name.toLowerCase() + ')';
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
      return normalizedName === normalizedQuery;
  } else {
      return `${normalizedName}`.indexOf(normalizedQuery) >= 0;
  }
};

export const filterTeam: ItemPredicate<ITeam> = (query, team, _index, exactMatch) => {
  const normalizedName = team.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
      return normalizedName === normalizedQuery;
  } else {
      return `${normalizedName}`.indexOf(normalizedQuery) >= 0;
  }
};

export const filterProperty: ItemPredicate<string> = (query, property, _index, exactMatch) => {
  const normalizedName = property.toLowerCase().split('_').join(' ');
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
      return normalizedName === normalizedQuery;
  } else {
      return `${normalizedName}`.indexOf(normalizedQuery) >= 0;
  }
};
