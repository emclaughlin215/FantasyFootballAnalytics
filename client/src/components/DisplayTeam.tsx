import { Divider, Position } from "@blueprintjs/core";
import React from "react";
import { IDisplayTeam, IDisplayPlayer, IPlayer } from "../index.d";


export function DisplayTeam(
    displayTeam: IDisplayTeam,
    teamSide: Position,
    setSelectedPlayerCallback: CallableFunction = () => {},
    onDragStartCallback: CallableFunction = () => {},
    onDragOverCallback: CallableFunction = () => {},
    onDragLeaveCallback: CallableFunction = () => {},
    onDropCallback: CallableFunction = () => {},
    pointsType: keyof IDisplayPlayer) {

    let current_position: string = ''; let team_positions: any[] = []; let team_row: any[] = [];
    let count = 0;
  
    displayTeam.team.forEach((player) => {
      const chance_of_playing_type = pointsType !== undefined ? 'chance_of_playing_this_round' : 'chance_of_playing_next_round';

      const current_player: IPlayer = displayTeam.players.filter((p) => p['id'] === player['element'])[0];
      const current_percent_chance_playing = current_player[chance_of_playing_type];
      const webname = current_player['web_name'];

      const render_player_colour = current_percent_chance_playing === 0 ? 'player-display-background-not-playing' :
        current_percent_chance_playing > 25 && current_percent_chance_playing < 100 ? 'player-display-background-maybe-playing' :
        'player-display-background-playing';
  
      if (count <= 11) {
        if (player['element_name'] !== current_position) {
          team_positions.push(<div className='position-layout'>{team_row}</div>)
          team_row = [];
        }
      }

      current_position = player['element_name'];
      team_row.push(
        <div className='player-display'
          onClick={() => setSelectedPlayerCallback(player['element'], teamSide)}
          draggable={teamSide === Position.LEFT}
          itemID={player.position}
          itemRef={player.element}
          onDragStart={(player) => onDragStartCallback(player)}
          onDragOver={(event) => onDragOverCallback(event)}
          onDragLeave={(event) => onDragLeaveCallback(event)}
          onDrop={() => onDropCallback()}
        >
          <div className={'player-display-background-playing ' + render_player_colour}></div>
          <div className='player-display-text'>
            <div className='player-display-name'>
              <div>{webname}</div>
              {
                player['is_captain']
                ? <div className='display-captain'>C</div> 
                :(player['is_vice_captain'] ?
                  <div className='display-vice-captain'>V</div>:
                  <div></div>)
              }
            </div>
            <Divider className='player-display-divider'/>
            <div>{(pointsType === 'event_points' ? player['event_points'] : 0) * player['multiplier']}</div>
          </div>  
        </div>)
      count += 1;
    })

    team_positions.push(<div className='position-layout-subs'>{team_row}</div>)
    return team_positions;
  } 