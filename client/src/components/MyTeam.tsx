import './MyTeam.scss';

import React from 'react';

import { IDisplayPlayer, IDisplayTeam, IStringFunctionMap } from '../index.d';
import { LoadState } from '../utils/LoadState';
import { Divider, Drawer, Tab, TabId, Tabs } from '@blueprintjs/core';
import { prop } from '../utils/TypeScript';
import PlayerDetails from './PlayerDetails';


export interface MyTeamState {
  navbarTabId: TabId;
  drawerIsOpen: boolean;
  selectedPlayer?: IDisplayPlayer;
}

export interface MyTeamProps {
  pickedTeam: LoadState<IDisplayTeam>
  selectedTeam: LoadState<IDisplayTeam>
  highestTeamThis: LoadState<IDisplayTeam>
  highestTeamNext: LoadState<IDisplayTeam>
}

export class MyTeam extends React.PureComponent<MyTeamProps, MyTeamState> {
  constructor(props: MyTeamProps) {
    super(props)
    this.state = {
      navbarTabId: 'current',
      drawerIsOpen: false,
    }
  }

  private compareTeams = (myTeam: LoadState<IDisplayTeam>, highestTeam: LoadState<IDisplayTeam>, pointsType: keyof IDisplayTeam) => {
    return (
      <div className='body-container'>
      <div className='pitches_container'>
        {[myTeam, highestTeam].map((team) => {
          let points = team.type === 'loaded' ? prop(team.value, pointsType) : 0;
          return (team.type === 'loaded' &&
            typeof points === 'number' &&
          <div>
            <div className='team-layout'>
            { 
              pointsType.toString() === 'actual_points' ?
              this.team(team.value, 'event_points') :
              this.team(team.value)
            }
            </div>
            <div className='team-stats'>
              {this.stat('Cost', [team.value.cost])}
              {
                pointsType.toString() === 'actual_points' ?
                this.stat('Points', [points, team.value.expected_points]) :
                this.stat('Points', [team.value.expected_points])
              }
            </div>
          </div>
        )})}
      </div>
      </div>
    )
  }

  private team(displayTeam: IDisplayTeam, pointsType?: keyof IDisplayPlayer) {
    let current_position: string = ''; let team_positions: any[] = []; let team_row: any[] = [];
    let count = 0;
    displayTeam.team.forEach((player) => {
      if (count <= 11) {
        if (player['element_name'] !== current_position) {
          team_positions.push(<div className='position-layout'>{team_row}</div>)
          team_row = [];
        }
      }
      if (count === 11) {
        team_positions.push(<div className='subs-divider-background'><Divider className='subs-divider'></Divider></div>)
      }
      current_position = player['element_name'];
      team_row.push(
        <div className='player-display' onClick={() => this.setSelectedPlayer(player)}>
          <div className={'player-display-background-playing'}></div>
          <div className='player-display-text'>
            <div className='player-display-name'>
              <div>{player['second_name']}</div>
              {
                player['is_captain']
                ? <div className='display-captain'>C</div> 
                :(player['is_vice_captain'] ?
                  <div className='display-vice-captain'>V</div>:
                  <div></div>)
              }
            </div>
            <Divider className='player-display-divider'/>
            <div>{(pointsType !== undefined ? player[pointsType] : 0) * player['multiplier']}</div>
          </div>  
        </div>)
      count += 1;
    })
    team_positions.push(<div className='position-layout'>{team_row}</div>)
    return team_positions;
  }

  private setSelectedPlayer(player: IDisplayPlayer): void {
    this.setState({selectedPlayer: player})
  }

  private stat(name: string, value: number[]) {
    return (
      <div className='stat-box'>
        <div className='stat-element'>
          {name}
        </div>
        <Divider className='stat-divider'/>
        <div className='stat-element'>
          {value.join(' / ')}
        </div>
      </div>
    )

  }

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() {
    const { pickedTeam, selectedTeam, highestTeamThis, highestTeamNext } = this.props;

    const tabIdToComponentMap: IStringFunctionMap = {
      "current": () => this.compareTeams(pickedTeam, highestTeamThis, "actual_points"),
      "next": () => this.compareTeams(selectedTeam, highestTeamNext, "expected_points"),
    } 

    return (
      <div className='player-analysis-tabs'>
        <Drawer
          className="selected-player-drawer"
          title={'Player Information: ' + this.state.selectedPlayer?.first_name + ' ' + this.state.selectedPlayer?.second_name}
          isOpen={this.state.selectedPlayer !== undefined}
          onClose={() => this.setState({selectedPlayer: undefined})}
          canOutsideClickClose={true}
          isCloseButtonShown={true}
        >
          <PlayerDetails player_id={this.state.selectedPlayer ? this.state.selectedPlayer.element : ''} />
        </Drawer>
        <Tabs
          animate={true}
          renderActiveTabPanelOnly={true}
          id="MainTabs"
          large={true}
          onChange={this.handleNavbarTabChange}
          selectedTabId={this.state.navbarTabId}
          vertical={true}>
          <Tab id="current" title="Current Points" />
          <Tab id="next" title="Next Game Week" />
          <Tabs.Expander />
        </Tabs>
        <div className='tab-container'>
          {tabIdToComponentMap[this.state.navbarTabId.toString()]()}
        </div>
      </div>
    )
  }
}
