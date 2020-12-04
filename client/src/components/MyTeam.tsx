import './MyTeam.scss';

import React from 'react';

import { IDisplayTeam, IStringElementMap, IStringFunctionMap } from '../index.d';
import { LoadState } from '../utils/LoadState';
import { Divider, Tab, TabId, Tabs } from '@blueprintjs/core';


export interface MyTeamState {
  navbarTabId: TabId;
}

export interface MyTeamProps {
  pickedTeam: LoadState<IDisplayTeam>
  selectedTeam: LoadState<IDisplayTeam>
  highestTeam: LoadState<IDisplayTeam>
}

export class MyTeam extends React.PureComponent<MyTeamProps, MyTeamState> {
  constructor(props: MyTeamProps) {
    super(props)
    this.state = {
      navbarTabId: 'current',
    }
  }

  private compareTeams = (myTeam: LoadState<IDisplayTeam>, highestTeam: LoadState<IDisplayTeam>) => {
    return (
      <div className='body-container'>
      <div className='pitches_container'>
        {[myTeam, highestTeam].map((team) => {
          return (team.type === 'loaded' &&
          <div>
            <div className='team-layout'>
              {this.team(team.value)}
            </div>
            <div className='team-stats'>
              {this.stat('Cost', [team.value.cost])}
              {this.stat('Points', [team.value.actual_points, team.value.expected_points])}
            </div>
          </div>
        )})}
      </div>
      </div>
    )
  }

  private team(displayTeam: IDisplayTeam) {
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
      let is_captain = player['is_captain'] ? true : false;
      let is_vice_captain = player['is_vice_captain'] ? true : false;
      team_row.push(
        <div className='player-display'>
          <div className='player-display-background'></div>
          <div className='player-display-text'>
            <div className='player-display-name'>
              <div>{player['second_name']}</div>
              {is_captain ?
                <div className='display_captain'>C</div> :
                (is_vice_captain ?
                  <div className='display_vice_captain'>V</div>:
                  <div></div>
                )}
            </div>
            <Divider className='player-display-divider'/>
            <div>{player['event_points'] * player['multiplier'] + ' (' + player['cost'] + ')'}</div>
          </div>
        </div>)
      count += 1;
    })
    team_positions.push(<div className='position-layout'>{team_row}</div>)
    return team_positions;
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
    const { pickedTeam, selectedTeam, highestTeam } = this.props;

    const tabIdToComponentMap: IStringFunctionMap = {
      "current": () => this.compareTeams(pickedTeam, highestTeam),
      "next": () => this.compareTeams(selectedTeam, highestTeam),
    }

    return (
      <div className='player-analysis-tabs'>
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
