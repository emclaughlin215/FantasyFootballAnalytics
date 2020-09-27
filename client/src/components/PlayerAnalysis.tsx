import './PlayerAnalysis.scss';

import { Divider, H3, Icon, MenuItem, Tab, TabId, Tabs } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addPropertiesToGraph, setFilteredPlayerList } from '../actions/PlayerActions';
import { IPlayer, IPlayerType, IStringElementMap, ITeam } from '../index.d';
import { IGlobalReducer } from '../reducers/GlobalReducers';
import { IPlayerReducer } from '../reducers/PlayerReducers';
import { ICombinedReducers } from '../reducers/Reducers';
import {
  filterPlayer,
  filterPlayerType,
  filterProperty,
  filterTeam,
  renderPlayer,
  renderPlayerInputValue,
  renderPlayerType,
  renderPlayerTypeInputValue,
  renderProperty,
  renderPropertyInputValue,
  renderTeam,
  renderTeamInputValue,
} from '../utils/PlayerAnalysis';
import News from './News';
import PlayerGraphs from './PlayerGraphs';

export interface IPlayerAnalysisProps {
  globalState: IGlobalReducer,
  playerState: IPlayerReducer,
  setFilteredPlayerList: typeof setFilteredPlayerList,
  addPropertiesToGraph: typeof addPropertiesToGraph,
}
 
export interface IPlayerAnalysisState { 
  navbarTabId: TabId;
 }

export class PlayerAnalysis extends React.PureComponent<IPlayerAnalysisProps, IPlayerAnalysisState> {
  constructor(props: IPlayerAnalysisProps) {
    super(props)
    this.state = {
      navbarTabId: 'playerGraphs',
    }
  }
 
  private filterPlayersByTeam(team: ITeam) {
    let filteredPlayersLatest: IPlayer[] = this.props.playerState.playerListLatest.type === 'loaded' ? this.props.playerState.playerListLatest.value : [];
    filteredPlayersLatest = filteredPlayersLatest.filter((player: IPlayer) => player.team === team.id);
    let filteredPlayers: IPlayer[] = this.props.playerState.playerList.type === 'loaded' ? this.props.playerState.playerList.value : [];
    filteredPlayers = filteredPlayers.filter((player: IPlayer) => player.team === team.id);
    this.props.setFilteredPlayerList(filteredPlayersLatest, filteredPlayers);
  }

  private filterPlayersByType(playerType: IPlayerType) {
    let filteredPlayersLatest: IPlayer[] = this.props.playerState.playerListLatest.type === 'loaded' ? this.props.playerState.playerListLatest.value : [];
    filteredPlayersLatest = filteredPlayersLatest.filter((player: IPlayer) => player.element_type === playerType.id);
    let filteredPlayers: IPlayer[] = this.props.playerState.playerList.type === 'loaded' ? this.props.playerState.playerList.value : [];
    filteredPlayers = filteredPlayers.filter((player: IPlayer) => player.element_type === playerType.id);
    this.props.setFilteredPlayerList(filteredPlayersLatest, filteredPlayers);
  }

  private handleSelectPlayer(selectedPlayer: IPlayer) {
    let filterToPlayerLatest: IPlayer[] = this.props.playerState.playerListLatest.type === 'loaded' ? this.props.playerState.playerListLatest.value : [];
    filterToPlayerLatest = filterToPlayerLatest.filter((player: IPlayer) => player.code === selectedPlayer.code);
    let filterToPlayer: IPlayer[] = this.props.playerState.playerList.type === 'loaded' ? this.props.playerState.playerList.value : [];
    filterToPlayer = filterToPlayer.filter((player: IPlayer) => player.code === selectedPlayer.code);
    this.props.setFilteredPlayerList(filterToPlayerLatest, filterToPlayer);
  }
      
  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() { 
    const { teamList, playerTypeList } = this.props.globalState;
    const { playerListLatest, filteredPlayerLatest } = this.props.playerState;

    const PlayerSuggest = Suggest.ofType<IPlayer>();
    const TeamSuggest = Suggest.ofType<ITeam>();
    const PlayerTypeSuggest = Suggest.ofType<IPlayerType>();
    const PropertySuggest = Suggest.ofType<string>();

    const latestPlayers: IPlayer[] = filteredPlayerLatest.type === 'loaded' ? filteredPlayerLatest.value : playerListLatest.type === 'loaded' ? playerListLatest.value : [];
    const propertiesOfPlayer: string[] = playerListLatest.type === 'loaded' ? Object.keys(playerListLatest.value[0]) : [];
    const teamListDisplay: ITeam[] = teamList.type === 'loaded' ? teamList.value : [];
    const playerTypeListDisplay: IPlayerType[] = playerTypeList.type === 'loaded' ? playerTypeList.value : [];
    const tabIdToComponentMap: IStringElementMap = {
        "playerNews": <News />,
        "playerGraphs": <PlayerGraphs />
      }
    return (
      <div className='body-container'>
        <div className='tab-title'>
          <Icon icon={'person'} iconSize={20} />
          <H3 className='bp3-heading'>Player Analysis</H3>
        </div>
        <div>
          <div className='dropdown-container'>
            <p className='dropdown'>Team</p>
            <TeamSuggest
              className={teamList.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
              itemPredicate={filterTeam}
              inputValueRenderer={renderTeamInputValue}
              onItemSelect={(team: ITeam) => this.filterPlayersByTeam(team)}
              items={teamListDisplay}
              itemRenderer={renderTeam}
              noResults={<MenuItem disabled={true} text="No results." />}
            />
            <Divider />
            <p className='dropdown' >Position</p>
            <PlayerTypeSuggest
              className={playerTypeList.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
              itemPredicate={filterPlayerType}
              disabled={filteredPlayerLatest.type === 'loading'}
              inputValueRenderer={renderPlayerTypeInputValue}
              onItemSelect={(playerType: IPlayerType) => { this.filterPlayersByType(playerType) }}
              items={playerTypeListDisplay}
              itemRenderer={renderPlayerType}
              noResults={<MenuItem disabled={true} text="No results." />}
            />
            <Divider />
            <p className='dropdown'>Player</p>
            <PlayerSuggest
              className={playerListLatest.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
              itemPredicate={filterPlayer}
              inputValueRenderer={renderPlayerInputValue}
              onItemSelect={(player: IPlayer) => this.handleSelectPlayer(player)}
              items={latestPlayers}
              itemRenderer={renderPlayer}
              noResults={<MenuItem disabled={true} text="No results." />}
            />
            <Divider />
            <p className='dropdown'>Attribute</p>
            <PropertySuggest
              className={playerListLatest.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
              itemPredicate={filterProperty}
              inputValueRenderer={renderPropertyInputValue}
              onItemSelect={(property: string) => this.props.addPropertiesToGraph(property as keyof IPlayer)}
              items={propertiesOfPlayer}
              itemRenderer={renderProperty}
              noResults={<MenuItem disabled={true} text="No results." />}
            />
          </div>
          <div className='player-analysis-tabs'>
            <Tabs
              animate={true}
              renderActiveTabPanelOnly={true}
              id="MainTabs"
              large={true}
              onChange={this.handleNavbarTabChange}
              selectedTabId={this.state.navbarTabId}
              vertical={true}>
              <Tab id="playerNews" title="News" />
              <Tab id="playerGraphs" title="Analysis" />
              <Tabs.Expander />
            </Tabs>
            <div>
              {tabIdToComponentMap[this.state.navbarTabId.toString()]}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ICombinedReducers) => {
  return {
    globalState: state.GlobalReducer,
    playerState: state.PlayerReducer,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      setFilteredPlayerList,
      addPropertiesToGraph,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerAnalysis);