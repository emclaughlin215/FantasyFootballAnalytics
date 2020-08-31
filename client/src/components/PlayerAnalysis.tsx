import './PlayerAnalysis.scss';

import { Card, Elevation, H3, Icon, MenuItem, Tab, TabId, Tabs } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import React from 'react';
import { connect } from 'react-redux';

import { IPlayer, IStringElementMap, ITeam } from '../index.d';
import { IGlobalReducer } from '../reducers/GlobalReducers';
import { ICombinedReducers } from '../reducers/Reducers';
import { loaded, loading, LoadState } from '../utils/LoadState';
import {
  filterPlayer,
  filterTeam,
  renderPlayer,
  renderPlayerInputValue,
  renderTeam,
  renderTeamInputValue,
} from '../utils/PlayerAnalysis';
import News from './News';

export interface IPlayerAnalysisProps {
  state: IGlobalReducer,
}
 
export interface IPlayerAnalysisState { 
  filteredPlayerList: LoadState<IPlayer[]>;
  navbarTabId: TabId;
  selectedPlayer?: IPlayer;
 }

export class PlayerAnalysis extends React.PureComponent<IPlayerAnalysisProps, IPlayerAnalysisState> {
  constructor(props: IPlayerAnalysisProps) {
    super(props)
    this.state = {
      filteredPlayerList: loading(),
      navbarTabId: 'playerNews',
    }
  }

  private filterPlayers(team: ITeam) {
    this.setState({ filteredPlayerList: loading() });
    let filteredPlayers: IPlayer[] = this.props.state.playerList.type === 'loaded' ? this.props.state.playerList.value : [];
    filteredPlayers = filteredPlayers.filter((player: IPlayer) => player.team === team.id);
    this.setState({ filteredPlayerList: loaded(filteredPlayers) })
  }

  private handleSelectPlayer(player: IPlayer) {
    this.setState({
      selectedPlayer: player
    })
  }

  private tabIdToComponentMap: IStringElementMap = {
    "playerNews": <News />,
    "playerHeatMap": <News />
  }

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  private displayActiveTab = (tabId: string) => this.tabIdToComponentMap[tabId];

  render() {
    const { teamList, playerList } = this.props.state;
    const PlayerSuggest = Suggest.ofType<IPlayer>();
    const TeamSuggest = Suggest.ofType<ITeam>();
    const statsToShow: any[][] = [
      ['Goals Scored (Assists)', this.state.selectedPlayer?.goals_scored, this.state.selectedPlayer?.assists],
      ['Creativity (Rank)', this.state.selectedPlayer?.creativity, this.state.selectedPlayer?.creativity_rank],
      ['Influence (Rank)', this.state.selectedPlayer?.influence, this.state.selectedPlayer?.influence_rank],
      ['Threat (Rank)', this.state.selectedPlayer?.threat, this.state.selectedPlayer?.threat_rank],
      ['Chance of Playing (next)', this.state.selectedPlayer?.chance_of_playing_this_round, this.state.selectedPlayer?.chance_of_playing_next_round],
    ]
    return (
      <div className='body-container'>
        <div className='tab-title'>
          <Icon icon={'person'} iconSize={20} />
          <H3 className='bp3-heading'>Player Analysis</H3>
        </div>
        <div>
          <div className='dropdown-container'>
            <TeamSuggest
              className={teamList.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
              itemPredicate={filterTeam}
              inputValueRenderer={renderTeamInputValue}
              onItemSelect={(team: ITeam) => { this.filterPlayers(team)}}
              items={teamList.type === 'loaded' ? teamList.value : []}
              itemRenderer={renderTeam}
              noResults={<MenuItem disabled={true} text="No results." />}
            />
            <PlayerSuggest
              className={playerList.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
              itemPredicate={filterPlayer}
              inputValueRenderer={renderPlayerInputValue}
              onItemSelect={(player: IPlayer) => { this.handleSelectPlayer(player) }}
              items={this.state.filteredPlayerList.type === 'loaded' ? this.state.filteredPlayerList.value : []}
              itemRenderer={renderPlayer}
              noResults={<MenuItem disabled={true} text="No results." />}
            />
            <div className='stats-container'>
              {statsToShow.map((stat) => {
                return (this.state.selectedPlayer !== undefined) && ((stat[1] !== null) || (stat[2] !== null)) &&
                <Card className='stats-card' interactive={false} elevation={Elevation.THREE}>
                  <h3>{stat[0]}</h3>
                  <p>{stat[1] + ' (' + stat[2] + ')'}</p>
                </Card>
              })}
            </div>
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
              <Tab id="playerHeatMap" title="Heat Map" />
              <Tabs.Expander />
            </Tabs>
            <div>
              {this.displayActiveTab(this.state.navbarTabId.toString())}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ICombinedReducers) => {
  return {
    state: state.GlobalReducer,
  };
}

export default connect(mapStateToProps)(PlayerAnalysis);