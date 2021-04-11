import { Button } from "@blueprintjs/core";
import React from "react";
import { IGameweekInfo, IChipsMetadata } from "../index.d";
import { getChipIntent } from "./Formatting";
import { LoadState } from "./LoadState";

export function chipIsBeingUsed(ChipStatus: IChipsMetadata | undefined, gameweekInfo: LoadState<IGameweekInfo>): boolean {
    if (chipLoadedAndUsed(ChipStatus)
      && (gameweekInfo.type === 'loaded')
      && (ChipStatus?.played_by_entry[0] === gameweekInfo.value.current.id)) {
        return true;
      }
      return false;
  }

export function chipHasBeenUsed(ChipStatus: IChipsMetadata | undefined, gameweekInfo: LoadState<IGameweekInfo>): boolean {
    if (chipLoadedAndUsed(ChipStatus)
      && (gameweekInfo.type === 'loaded')
      && (ChipStatus?.played_by_entry[0] !== gameweekInfo.value.current.id)) {
        return true;
      }
      return false;
  }

function chipLoadedAndUsed(ChipStatus: IChipsMetadata | undefined): boolean {
    if (ChipStatus === undefined) {
      return false;
    }
    if ((ChipStatus.status_for_entry === 'played') && (ChipStatus.played_by_entry.length === 1)) {
      return true;
    }
    return false;
  }

  export function maybeChipButton(ChipStatus: IChipsMetadata | undefined, text: string, toggleChipCallback: CallableFunction, isInUse: boolean, gameweekInfo: LoadState<IGameweekInfo>) {
    if (ChipStatus === undefined) {
      return;
    }
    if (chipIsBeingUsed(ChipStatus, gameweekInfo)) {
      text += ' (in use)';
    } else if (chipHasBeenUsed(ChipStatus, gameweekInfo)) {
      text += ' (used in GW ' + ChipStatus.played_by_entry[0] + ') ';
    } else if (isInUse) {
      text += ' (in use)';
    }
    return <Button className='token-button' disabled={(ChipStatus.status_for_entry === 'played')} intent={getChipIntent(ChipStatus, isInUse)} large={true} onClick={() => toggleChipCallback()}>{text}</Button>
  }