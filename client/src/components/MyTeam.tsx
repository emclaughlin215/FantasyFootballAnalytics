import './MyTeam.scss';

import React from 'react';

import { IDisplayPlayer, IDisplayTeam, IGameweekInfo, IPlayer, IStringFunctionMap } from '../index.d';
import { getPropertyIfLoadedOrElse, LoadState } from '../utils/LoadState';
import { Button, Divider, Drawer, MenuItem, Position, Tab, TabId, Tabs } from '@blueprintjs/core';
import { prop } from '../utils/TypeScript';
import PlayerDetails from './PlayerDetails';
import { Suggest } from '@blueprintjs/select';
import { filterPlayer, renderPlayerInputValue, renderPlayer } from '../utils/Suggest';
import PlayerGraphs from './PlayerGraphs';
import { connect } from 'react-redux';
import { ICombinedReducers } from '../reducers/Reducers';
import { IPlayerReducer } from '../reducers/PlayerReducers';


export interface MyTeamState {
  navbarTabId: TabId;
  playerDetailsDrawIsOpen: boolean;
  playerDetailsDrawerSide: Position;
  selectedPlayerDetails?: IDisplayPlayer;
  comparePlayersDrawerIsOpen: boolean;
  comparePlayerSelectedLeft?: IPlayer;
  comparePlayerSelectedRight?: IPlayer;
}

export interface MyTeamOwnProps {
  pickedTeam: LoadState<IDisplayTeam>
  selectedTeam: LoadState<IDisplayTeam>
  highestTeamThis: LoadState<IDisplayTeam>
  highestTeamNext: LoadState<IDisplayTeam>
  gameweekInfo: LoadState<IGameweekInfo>
}

interface MyTeamStateProps {
  playerState: IPlayerReducer
}

type MyTeamProps = MyTeamOwnProps & MyTeamStateProps;

export class MyTeam extends React.PureComponent<MyTeamProps, MyTeamState> {
  constructor(props: MyTeamProps) {
    super(props)
    this.state = {
      navbarTabId: 'current',
      playerDetailsDrawIsOpen: false,
      playerDetailsDrawerSide: Position.RIGHT,
      comparePlayersDrawerIsOpen: false
    }
  }

  private comparePlayersDrawerOpen() {
    this.setState({ comparePlayersDrawerIsOpen: true })
  }

  private compareTeams = (myTeam: LoadState<IDisplayTeam>, highestTeam: LoadState<IDisplayTeam>, pointsType: keyof IDisplayTeam) => {
    
    const PlayerSuggest = Suggest.ofType<IPlayer>();
    const { comparePlayerSelectedLeft, comparePlayerSelectedRight } = this.state;
    const { playerListLatest } = this.props.playerState;
    const playersBeingCompared: IPlayer[] = [];
    [comparePlayerSelectedLeft, comparePlayerSelectedRight]
      .map(player => {
        return player !== undefined ? playersBeingCompared.push(player) : null;
      });

    return (
    <div className='compare-teams-container'>
        <Drawer
          className="selected-player-drawer"
          title={'Player Comparison' + (comparePlayerSelectedLeft && comparePlayerSelectedRight && ': ' + 
            prop(comparePlayerSelectedLeft, 'first_name') + ' ' + 
            prop(comparePlayerSelectedLeft, 'second_name') + ' vs ' +
            prop(comparePlayerSelectedRight, 'first_name') + ' ' + 
            prop(comparePlayerSelectedRight, 'second_name')) + ''}
          isOpen={this.state.comparePlayersDrawerIsOpen}
          onClose={() => this.setState({comparePlayersDrawerIsOpen: false})}
          canOutsideClickClose={true}
          isCloseButtonShown={true}
          position={Position.BOTTOM}
          size={Drawer.SIZE_LARGE}
        >
          <div className='compare-player-container'>
            <div className='compare-player-details-container'>
              <div className='compare-player-left compare-player-select'>
                <PlayerSuggest
                  className={this.props.pickedTeam.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
                  itemPredicate={filterPlayer}
                  inputValueRenderer={renderPlayerInputValue}
                  onItemSelect={(player: IPlayer) => this.handleSelectPlayer(player, Position.LEFT)}
                  items={getPropertyIfLoadedOrElse(myTeam, 'players', []).sort((a, b) => a.element_type - b.element_type)}
                  itemRenderer={renderPlayer}
                  noResults={<MenuItem disabled={true} text="No results." />}
                />
              </div>
              <div className='compare-player-left compare-player-details'>
              <PlayerDetails player_id={comparePlayerSelectedLeft ? comparePlayerSelectedLeft.id.toString() : ''}/>
              </div>
              <div className='compare-player-right compare-player-select'>
                <PlayerSuggest
                  className={this.props.pickedTeam.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
                  itemPredicate={filterPlayer}
                  inputValueRenderer={renderPlayerInputValue}
                  onItemSelect={(player: IPlayer) => this.handleSelectPlayer(player, Position.RIGHT)}
                  items={getPropertyIfLoadedOrElse(highestTeam, 'players', []).sort((a, b) => a.element_type - b.element_type)}
                  itemRenderer={renderPlayer}
                  noResults={<MenuItem disabled={true} text="No results." />}
                />
              </div>
              <div className='compare-player-right compare-player-details'>
                <PlayerDetails player_id={comparePlayerSelectedRight ? comparePlayerSelectedRight.id.toString() : ''}/>
              </div>
            </div>
            <PlayerGraphs playerListLatest={playerListLatest} filteredPlayer={playersBeingCompared}/> 
          </div>
        </Drawer>
      <Button
        className='compare-players-button'
        intent='primary'
        onClick={() => this.comparePlayersDrawerOpen()
      }>
        Compare Players
      </Button>
      <div className='body-container'>
        <div className='pitches_container'>
          {[myTeam, highestTeam].map((team, team_idx) => {
            let points = team.type === 'loaded' ? prop(team.value, pointsType) : 0;
            return (
              team.type === 'loaded' &&
              typeof points === 'number' &&
              <div>
                <div className='team-layout'>
                { 
                  pointsType.toString() === 'actual_points' ?
                  this.team(team.value, team_idx, 'event_points') :
                  this.team(team.value, team_idx)
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
            )}
          )}
        </div>
      </div>
    </div>
    )
  }

  private team(displayTeam: IDisplayTeam, team_idx: number, pointsType?: keyof IDisplayPlayer) {
    let team_side = team_idx === 0 ? Position.RIGHT : Position.LEFT;
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
        <div className='player-display' onClick={() => this.setSelectedPlayer(player, team_side)}>
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

  private setSelectedPlayer(player: IDisplayPlayer, team_side: Position): void {
    this.setState({selectedPlayerDetails: player, playerDetailsDrawerSide: team_side})
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

  private handleSelectPlayer = (selectedPlayer: IPlayer, side: Position) => {
    if (side === Position.LEFT) {
      this.setState({comparePlayerSelectedLeft: selectedPlayer})
    } else {
      this.setState({comparePlayerSelectedRight: selectedPlayer})
    }
  }

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() {
    const { pickedTeam, selectedTeam, highestTeamThis, highestTeamNext } = this.props;
    const { selectedPlayerDetails, playerDetailsDrawerSide } = this.state;

    const tabIdToComponentMap: IStringFunctionMap = {
      "current": () => this.compareTeams(pickedTeam, highestTeamThis, "actual_points"),
      "next": () => this.compareTeams(selectedTeam, highestTeamNext, "expected_points"),
    }

    return (
      <div className='player-analysis-tabs'>
        <Drawer
          className="selected-player-drawer"
          title={'Player Information: ' + (selectedPlayerDetails ? (selectedPlayerDetails.first_name + ' ' + selectedPlayerDetails.second_name + ' - ' + selectedPlayerDetails.element_name) : '')}
          isOpen={selectedPlayerDetails !== undefined}
          onClose={() => this.setState({selectedPlayerDetails: undefined})}
          canOutsideClickClose={true}
          isCloseButtonShown={true} 
          position={playerDetailsDrawerSide}
          size={Drawer.SIZE_LARGE}
        >
          <PlayerDetails player_id={selectedPlayerDetails ? selectedPlayerDetails.element : ''}/>
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

const mapStateToProps = (state: ICombinedReducers) => {
  return {
    playerState: state.PlayerReducer,
  };
}

export default connect(mapStateToProps)(MyTeam);