import './PlayerAnalysis.scss';

import { Divider, H3, Icon, MenuItem, Tab, TabId, Tabs } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setFilteredPlayerList } from '../actions/PlayerActions';
import { IPlayer, IPlayerType, IStringElementMap, ITeam } from '../index.d';
import { IGlobalReducer } from '../reducers/GlobalReducers';
import { IPlayerReducer } from '../reducers/PlayerReducers';
import { ICombinedReducers } from '../reducers/Reducers';
import { createPlayerTypeStub, createTeamStub } from '../utils/Stubs';
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

    const playerType = playerTypeSelected ? playerTypeSelected :
      playerTypeAlreadySelected ? playerTypeAlreadySelected :
      undefined;
    const team = teamSelected ? teamSelected :
      teamAlreadySelected ? teamAlreadySelected :
      undefined;

    if (team === undefined && playerType === undefined) {
      return;
    }

    if (playerType !== undefined) {
      if (playerType.plural_name !== 'All') {
        playersLatest = playersLatest.filter((player: IPlayer) => player.element_type === playerType.id);
        players = players.filter((player: IPlayer) => player.element_type === playerType.id);
      }
      this.setState({ playerTypeAlreadySelected: playerType });
    }

    if (team !== undefined) {
      if (team.name !== 'All') {
        playersLatest = playersLatest.filter((player: IPlayer) => player.team === team.id);
        players = players.filter((player: IPlayer) => player.team === team.id);
      }
      this.setState({ teamAlreadySelected: team });
    }
    
    this.setState({ playersForDropdown: playersLatest });
    this.props.setFilteredPlayerList(playersLatest, players);
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
    const { playersForDropdown } = this.state;

    const PlayerSuggest = Suggest.ofType<IPlayer>();
    const TeamSuggest = Suggest.ofType<ITeam>();
    const PlayerTypeSuggest = Suggest.ofType<IPlayerType>();

    let latestPlayers: IPlayer[] = playersForDropdown ? playersForDropdown :
      playerListLatest.type === 'loaded' ? playerListLatest.value :
      [];
    latestPlayers = latestPlayers.sort((a, b) => a.second_name.toString().localeCompare(b.second_name.toString()));

    let teamListDisplay: ITeam[] = teamList.type === 'loaded' ? teamList.value : [];
    const allTeamStub = createTeamStub('All');
    teamListDisplay.unshift(allTeamStub);

    let playerTypeListDisplay: IPlayerType[] = playerTypeList.type === 'loaded' ? playerTypeList.value : [];
    const allPlayerTypeStub = createPlayerTypeStub('All');
    playerTypeListDisplay.unshift(allPlayerTypeStub);

    const tabIdToComponentMap: IStringElementMap = {
        "playerNews": <News />,
        "playerGraphs": <PlayerGraphs />,
        "playerRanking": <PerformanceAnalysis />
    }

    return (
      <div className='body-container'>
        <div className='title-control'>
          <div className='tab-title'>
            <Icon className='icon-title' icon={'person'} iconSize={20} />
            <H3 className='bp3-heading'>Player Analysis</H3>
          </div>
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
              disabled={filteredPlayerLatest.type === 'loading'}
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
        <div>
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
              <Tab id="playerGraphs" title="Trends" />
              <Tab id="playerRanking" title="Discovery" />
              <Tabs.Expander />
            </Tabs>
            <div className='tab-container'>
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
