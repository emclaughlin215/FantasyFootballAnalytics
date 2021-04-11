import { Divider, Position } from "@blueprintjs/core";
import React from "react";
import { IDisplayTeam, IDisplayPlayer } from "../index.d";
import { getOrZero } from "../utils/Number";


export function DisplayTeam(
    displayTeam: IDisplayTeam,
    teamSide: Position,
    setSelectedPlayerCallback: CallableFunction,
    onDragPlayerStartCallback: CallableFunction,
    onDragPlayerOverCallback: CallableFunction,
    onDragPlayerLeaveCallback: CallableFunction,
    onDropPlayerCallback: CallableFunction,
    onDragCaptainStartCallback: CallableFunction,
    onDragCaptainOverCallback: CallableFunction,
    onDragCaptainLeaveCallback: CallableFunction,
    onDragCaptainDropCallback: CallableFunction,
    pointsType: keyof IDisplayPlayer) {

    let currentType: string = ''; let team_positions: any[] = []; let team_row: any[] = [];
    let count = 0;
  
    Object.entries(displayTeam.team).map(pl => pl[1]).sort((a, b) => a.position - b.position).forEach((player, idx) => {
      const chance_of_playing_type = pointsType === 'event_points' ? 'chance_of_playing_this_round' : 'chance_of_playing_next_round';
      const current_percent_chance_playing = player[chance_of_playing_type];
      const render_player_colour = current_percent_chance_playing === 0 ? 'player-display-background-not-playing' :
        current_percent_chance_playing > 25 && current_percent_chance_playing < 100 ? 'player-display-background-maybe-playing' :
        'player-display-background-playing';
  
      if (count <= 11) {
        if (player['element_name'] !== currentType) {
          team_positions.push(<div className='position-layout'>{team_row}</div>)
          team_row = [];
        }
      }

      currentType = player['element_name'];
      team_row.push(
        <div
          className='player-display'
          key={idx}
          onClick={() => setSelectedPlayerCallback(player, teamSide, currentType)}
          draggable={teamSide === Position.LEFT}
          itemID={player.position}
          itemRef={player.id.toString()}
          onDragStart={(player) => onDragPlayerStartCallback(player, teamSide, currentType)}
          onDragOver={(event) => onDragPlayerOverCallback(event, teamSide, currentType)}
          onDragLeave={(event) => onDragPlayerLeaveCallback(event)}
          onDrop={(event) => onDropPlayerCallback(event)}
        >
          <div className={'player-display-background-playing ' + render_player_colour}></div>
          <div className='player-display-text'>
            <div className='player-display-name'>
              <div>{player['web_name']}</div>
              {
                player['is_captain']
                ? <div
                    className='display-captain'
                    draggable={teamSide === Position.LEFT}
                    itemID={player.position}
                    onDragStart={(event) => onDragCaptainStartCallback(event, 'captain')}
                    onDragOver={(event) => onDragCaptainOverCallback(event)}
                    onDragLeave={(event) => onDragCaptainLeaveCallback(event)}
                    onDrop={(event) => onDragCaptainDropCallback(event)}
                  >C</div> 
                :(player['is_vice_captain'] ?
                  <div
                    className='display-vice-captain'
                    draggable={teamSide === Position.LEFT}
                    itemID={player.position}
                    onDragStart={(event) => onDragCaptainStartCallback(event, 'vice')}
                    onDragOver={(event) => onDragCaptainOverCallback(event)}
                    onDragLeave={(event) => onDragCaptainLeaveCallback(event)}
                    onDrop={(event) => onDragCaptainDropCallback(event)}
                  >V</div>
                : <div
                    className='display-no-captain'
                    draggable={teamSide === Position.LEFT}
                    itemID={player.position}
                    onDragOver={(event) => onDragCaptainOverCallback(event)}
                    onDragLeave={(event) => onDragCaptainLeaveCallback(event)}
                    onDrop={(event) => onDragCaptainDropCallback(event)}
                  >-</div>)
              }
            </div>
            <Divider className='player-display-divider'/>
            <div>{(pointsType === 'event_points' ? player['event_points'] : player['ep_next']) * getOrZero(player['multiplier'])}</div>
          </div>  
        </div>)
      count += 1;
    })

    team_positions.push(<div className='position-layout-subs'>{team_row}</div>)
    return team_positions;
  } 