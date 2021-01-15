import './PlayerAnalysis.scss';

import { Divider, MenuItem, Tab, TabId, Tabs } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setFilteredPlayerList } from '../actions/PlayerActions';
import { IPlayer, IPlayerType, IStringElementMap, ITeam } from '../index.d';
import { IGlobalReducer } from '../reducers/GlobalReducers';
import { IPlayerReducer } from '../reducers/PlayerReducers';
import { ICombinedReducers } from '../reducers/Reducers';
import {
  filterPlayer,
  filterPlayerType,
  filterTeam,
  renderPlayer,
  renderPlayerInputValue,
  renderPlayerType,
  renderPlayerTypeInputValue,
  renderTeam,
  renderTeamInputValue,
} from '../utils/Suggest';
import News from './News';
import PerformanceAnalysis from './PerformanceAnalysis';
import PlayerGraphs from './PlayerGraphs';
import { getIfLoadedOrElse } from '../utils/LoadState';

export interface IPlayerAnalysisProps {
  globalState: IGlobalReducer,
  playerState: IPlayerReducer,
  setFilteredPlayerList: typeof setFilteredPlayerList,
}
 
export interface IPlayerAnalysisState { 
  navbarTabId: TabId;
  teamAlreadySelected?: ITeam;
  playerTypeAlreadySelected?: IPlayerType;
  playersForDropdown?: IPlayer[];
 }

export class PlayerAnalysis extends React.PureComponent<IPlayerAnalysisProps, IPlayerAnalysisState> {
  constructor(props: IPlayerAnalysisProps) {
    super(props)
    this.state = {
      navbarTabId: 'playerGraphs',
    }
  }

  private filterPlayers(playerTypeSelected?: IPlayerType, teamSelected?: ITeam) {

    const { playerTypeAlreadySelected, teamAlreadySelected } = this.state;

    let playersLatest: IPlayer[] = this.props.playerState.playerListLatest.type === 'loaded' ?
      this.props.playerState.playerListLatest.value :
      [];
    let players: IPlayer[] = this.props.playerState.playerList.type === 'loaded' ?
      this.props.playerState.playerList.value :
      [];

    const playerType = playerTypeSelected?.plural_name === 'All' ? undefined :
      playerTypeSelected ? playerTypeSelected :
      playerTypeAlreadySelected ? playerTypeAlreadySelected :
      undefined;
    const team = teamSelected?.name === 'All' ? undefined :
      teamSelected ? teamSelected :
      teamAlreadySelected ? teamAlreadySelected :
      undefined;

    if ((team === undefined) && (playerType === undefined)) {
    } else if (team !== undefined && playerType === undefined) {
        playersLatest = playersLatest.filter((player: IPlayer) => player.team === team.id);
        players = players.filter((player: IPlayer) => player.team === team.id);
        if (playerTypeAlreadySelected) {
          playersLatest = playersLatest.filter((player: IPlayer) => player.element_type === playerTypeAlreadySelected.id);
          players = players.filter((player: IPlayer) => player.element_type === playerTypeAlreadySelected.id);
        }
    } else if (team === undefined && playerType !== undefined) {
        playersLatest = playersLatest.filter((player: IPlayer) => player.element_type === playerType.id);
        players = players.filter((player: IPlayer) => player.element_type === playerType.id);
        if (teamAlreadySelected) {
          playersLatest = playersLatest.filter((player: IPlayer) => player.team === teamAlreadySelected.id);
          players = players.filter((player: IPlayer) => player.team === teamAlreadySelected.id);
        }
    } else if (team !== undefined && playerType !== undefined) {
        playersLatest = playersLatest.filter((player: IPlayer) => player.team === team.id && player.element_type === playerType.id);
        players = players.filter((player: IPlayer) => player.team === team.id && player.element_type === playerType.id);
    }
    this.setState({
      teamAlreadySelected: team,
      playerTypeAlreadySelected: playerType,
      playersForDropdown: playersLatest
    });
    this.props.setFilteredPlayerList(playersLatest, players);
  }

  private handleSelectPlayer(selectedPlayer: IPlayer) {
    const { playerState } = this.props;
    const playersList: IPlayer[] = getIfLoadedOrElse(playerState.playerListLatest, []);
    const filterToPlayerLatest = playersList.filter((player: IPlayer) => player.code === selectedPlayer.code);
    const filterToPlayer = playersList.filter((player: IPlayer) => player.code === selectedPlayer.code);
    this.props.setFilteredPlayerList(filterToPlayerLatest, filterToPlayer);
  }
      
  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() { 
    const { teamList, playerTypeList } = this.props.globalState;
    const { playerListLatest, filteredPlayer } = this.props.playerState;
    const { playersForDropdown } = this.state;

    const PlayerSuggest = Suggest.ofType<IPlayer>();
    const TeamSuggest = Suggest.ofType<ITeam>();
    const PlayerTypeSuggest = Suggest.ofType<IPlayerType>();

    let latestPlayers: IPlayer[] = playersForDropdown ? playersForDropdown : getIfLoadedOrElse(playerListLatest, []);
    latestPlayers = latestPlayers.sort((a, b) => a.second_name.toString().localeCompare(b.second_name.toString()));

    let teamListDisplay: ITeam[] = getIfLoadedOrElse(teamList,  []);
    let playerTypeListDisplay: IPlayerType[] = getIfLoadedOrElse(playerTypeList, []);

    const tabIdToComponentMap: IStringElementMap = {
        "playerNews": <News />,
        "playerGraphs": <PlayerGraphs filteredPlayer={filteredPlayer} playerListLatest={playerListLatest} />,
        "playerRanking": <PerformanceAnalysis />
    }

    return (
      <div className='body-container'>
        <div>
          <div className='player-analysis-tabs'>
            <Tabs
              animate={true}
              renderActiveTabPanelOnly={true}
              id="MainTabs"
              large={true}
              onChange={this.handleNavbarTabChange}
              selectedTabId={this.state.navbarTabId}
              vertical={false}>
              <Tabs.Expander />
              <Tab id="playerGraphs" title="Trends" />
              <Tab id="playerNews" title="News" />
              <Tab id="playerRanking" title="Discovery" />
            </Tabs>
            <div className='tab-container'>
              <div className='title-control'>
                <div className='dropdown-container'>
                  <p className='dropdown'>Team</p>
                  <TeamSuggest
                    className={teamList.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
                    itemPredicate={filterTeam}
                    inputValueRenderer={renderTeamInputValue}
                    onItemSelect={(team: ITeam) => this.filterPlayers(undefined, team)}
                    items={teamListDisplay}
                    itemRenderer={renderTeam}
                    noResults={<MenuItem disabled={true} text="No results." />}
                  /> 
                  <Divider />
                  <p className='dropdown' >Position</p>
                  <PlayerTypeSuggest
                    className={playerTypeList.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
                    itemPredicate={filterPlayerType}
                    inputValueRenderer={renderPlayerTypeInputValue}
                    onItemSelect={(playerType: IPlayerType) => { this.filterPlayers(playerType, undefined) }}
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
                </div>
              </div>
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
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerAnalysis);
