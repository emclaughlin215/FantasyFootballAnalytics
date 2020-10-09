import './MyTeam.scss';

import React from 'react';

import { IPickedTeam } from '../index.d';
import { loading, LoadState } from '../utils/LoadState';


export interface MyTeamState {
}

export interface MyTeamProps {
  pickedTeam: LoadState<IPickedTeam[]>
}

export class MyTeam extends React.PureComponent<MyTeamProps, MyTeamState> {
  constructor(props: MyTeamProps) {
    super(props)
    this.state = {
      pickedTeam: loading(),
    }
  }

  private team() {
    const { pickedTeam } = this.props;
    let current_position: string = ''; let team_positions: any[] = []; let team_row: any[] = [];
    let count = 0;
    pickedTeam.type === 'loaded' && pickedTeam.value.forEach((player) => {
      if (count <= 11) {
        if (player['element_name'] !== current_position) {
          team_positions.push(<div className='position-layout'>{team_row}</div>)
          team_row = [];
        }
      }
      if (count === 11) {
        team_row.push(<p>Subs: </p>)
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

    return (
      <div className='body-container'>
        <div className='team-layout'>
          {this.team()}
        </div>
      </div>
    )
  }
}