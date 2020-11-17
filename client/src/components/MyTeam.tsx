import './MyTeam.scss';

import React from 'react';

import { IDisplayTeam } from '../index.d';
import { LoadState } from '../utils/LoadState';


export interface MyTeamState {
}

export interface MyTeamProps {
  pickedTeam: LoadState<IDisplayTeam>
  selectedTeam: LoadState<IDisplayTeam>
  highestTeam: LoadState<IDisplayTeam>
}

export class MyTeam extends React.PureComponent<MyTeamProps, MyTeamState> {
  constructor(props: MyTeamProps) {
    super(props)
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
        team_row.push(<p className='player-display'>Subs: </p>)
      }
      current_position = player['element_name'];
      team_row.push(
        <div className='player-display'>
          <p>{player['second_name']}</p>
          <p>{player['is_captain'] ? ' (c)' : player['is_vice_captain'] ? ' (v)' : ''}</p>
        </div>)
      count += 1;
    })
    team_positions.push(<div className='position-layout'>{team_row}</div>)
    return team_positions;
  }

  render() {
    const { pickedTeam, selectedTeam, highestTeam } = this.props;
    return (
      <div className='body-container'>
        <div className='pitches_container'>
          {[selectedTeam, highestTeam].map((team) => {
            return (team.type === 'loaded' &&
            <div className='team-layout'>
              {this.team(team.value)}
            </div>
          )})}
        </div>
      </div> 
    )
  }
}