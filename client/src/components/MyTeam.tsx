import './MyTeam.scss';

import React, { DragEventHandler } from 'react';

import { IDisplayPlayer, IDisplayTeam, IGameweekInfo, IPlayer, IStringFunctionMap, ITransfer } from '../index.d';
import { getPropertyIfLoadedOrElse, loaded, loading, LoadState } from '../utils/LoadState';
import { Button, Classes, Dialog, Divider, Drawer, Intent, MenuItem, NonIdealState, Overlay, Position, Tab, TabId, Tabs, Tag, Text } from '@blueprintjs/core';
import { prop } from '../utils/TypeScript';
import PlayerDetails from './PlayerDetails';
import { Suggest } from '@blueprintjs/select';
import { filterPlayer, renderPlayerInputValue, renderPlayer } from '../utils/Suggest';
import PlayerGraphs from './PlayerGraphs';
import { connect } from 'react-redux';
import { ICombinedReducers } from '../reducers/Reducers';
import { IPlayerReducer } from '../reducers/PlayerReducers';
import { DisplayTeam } from './DisplayTeam';
import classes from '*.module.css';


interface ProposedChange {
  playerIn?: string;
  playerInId?: string;
  playerInName?: string;
  playerOut?: string;
  playerOutId?: string;
  playerOutName?: string;
}

export interface MyTeamState {
  navbarTabId: TabId;
  playerDetailsDrawIsOpen: boolean;
  playerDetailsDrawerSide: Position;
  comparePlayersDrawerIsOpen: boolean;
  suggestedTransfers: LoadState<ITransfer[]>;
  selectedPlayerDetails?: number;
  comparePlayerSelectedLeft?: number;
  comparePlayerSelectedRight?: number;
  newSubstitute?: ProposedChange;
  openSubstitutes: ProposedChange[];
  openTransfers: ProposedChange[];
  confirmSubstitutes: boolean;
  confirmTransfers: boolean;
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
      comparePlayersDrawerIsOpen: false,
      suggestedTransfers: loading(),
      openSubstitutes: [],
      openTransfers: [],
      confirmSubstitutes: false,
      confirmTransfers: false,
    }
  }

  async componentDidMount() {
    const transfers: Response = await fetch('http://localhost:8000/transfers/suggested/');
    const transfersJson: ITransfer[] = await transfers.json();

    this.setState({
      suggestedTransfers: loaded(transfersJson),
    })
  }

  private comparePlayersDrawerOpen(player_a_id?: number, player_b_id?: number) {

    const { playerState, selectedTeam, highestTeamNext } = this.props;

    const player_a: number | undefined = (player_a_id && playerState.playerListLatest.type === 'loaded')
      ? playerState.playerListLatest.value.filter(player => player.id === player_a_id)[0].id
      : selectedTeam.type === 'loaded' ? selectedTeam.value.players[0].id
      : undefined;

    const player_b: number | undefined = (player_b_id && playerState.playerListLatest.type === 'loaded')
      ? playerState.playerListLatest.value.filter(player => player.id === player_b_id)[0].id
      : highestTeamNext.type === 'loaded' ? highestTeamNext.value.players[0].id
      : undefined;

    if (player_a !== undefined && player_b !== undefined) {
      this.setState({ comparePlayerSelectedLeft: player_a, comparePlayerSelectedRight: player_b, comparePlayersDrawerIsOpen: true})
    } else {
      this.setState({ comparePlayersDrawerIsOpen: true})
    }
  }

  private compareTeams = (
    myTeam: LoadState<IDisplayTeam>,
    highestTeam: LoadState<IDisplayTeam>,
    pointsType: keyof IDisplayPlayer) => {
    
    const PlayerSuggest = Suggest.ofType<IPlayer>();
    const { comparePlayerSelectedLeft, comparePlayerSelectedRight } = this.state;
    const { playerListLatest } = this.props.playerState;
    // const playersBeingCompared: LoadState<IPlayer[]> = loaded([]);
    // [comparePlayerSelectedLeft, comparePlayerSelectedRight].map(player => player !== undefined ? playersBeingCompared.value.push(player) : null);

    return (
    <div className='compare-teams-container'>
        <Drawer
          className="selected-player-drawer"
          title={'Player Comparison'}
          isOpen={this.state.comparePlayersDrawerIsOpen}
          onClose={() => this.setState({comparePlayersDrawerIsOpen: false})}
          canOutsideClickClose={true}
          isCloseButtonShown={true}
          position={Position.BOTTOM}
          size={Drawer.SIZE_LARGE}>
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
              {comparePlayerSelectedLeft ? <div className='compare-player-left compare-player-details'>
                <PlayerDetails player_id={comparePlayerSelectedLeft.toString()} gameweek={this.props.gameweekInfo}/>
              </div> : <NonIdealState className="graph-non-ideal-state" title="Select a Player from the dropdown" description="..." />}
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
                <PlayerDetails player_id={comparePlayerSelectedRight ? comparePlayerSelectedRight.toString() : ''} gameweek={this.props.gameweekInfo}/>
              </div>
            </div>
            {/* <PlayerGraphs playerListLatest={playerListLatest} filteredPlayer={playersBeingCompared}/>  */}
          </div>
        </Drawer>
      <div className='team-config-buttons-wrapper'>
        <Button className='team-config-button' intent='primary' onClick={() => this.comparePlayersDrawerOpen()}> Compare Players </Button>
        <Button className='team-config-button' intent='success' disabled={this.checkOpenSubstitutes()} onClick={() => this.confirmSubstitutesToggle()}>
          Confirm Substitutes </Button>
        <Button className='team-config-button' intent='success' disabled={this.checkOpenTransfers()} onClick={() => this.confirmTransfersToggle()}> Confirm Tranfers </Button>
        <Button className='team-config-button' intent='warning' disabled={this.checkOpenTransfers() && this.checkOpenSubstitutes()} onClick={() => this.resetChanges()}>
          Reset </Button>
      </div>
      <div className='body-container'>
        <div className='pitches_container'>
          {[myTeam, highestTeam].map((team, index) => {
            const points = team.type === 'loaded' ? pointsType === 'event_points' ? prop(team.value, 'actual_points') : prop(team.value, 'expected_points') : 0;
            return (
              team.type === 'loaded' && typeof points === 'number' &&
              <div>
                <div className='team-layout'>
                  {
                    index === 0 ?
                    DisplayTeam(team.value, Position.LEFT, this.setSelectedPlayer, this.dragPlayerStart, this.dragPlayerOver, this.dragPlayerLeave, this.addSubstitute, pointsType) :
                    DisplayTeam(team.value, Position.RIGHT, this.setSelectedPlayer, this.dragPlayerStart, this.dragPlayerOver, this.dragPlayerLeave, this.addSubstitute,
                    pointsType)
                  }
                </div>
                <div className='team-stats'>
                  {this.stat('Cost', [team.value.cost])}
                  {pointsType.toString() === 'event_points' ?
                    this.stat('Points', [points, team.value.expected_points]) :
                    this.stat('Points', [team.value.expected_points])}
                </div>
              </div>
            )}
          )}
        </div>
      </div>
    </div>
    )
  }

  private dragPlayerStart = (event: React.DragEvent<HTMLDivElement>): void => {
    this.setState({
      newSubstitute: {
        ...this.state.newSubstitute,
        playerIn: event.currentTarget.attributes[2].value,
        playerInId: event.currentTarget.attributes[3].value,
    }})
  }

  private dragPlayerOver= (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    this.setState({
      newSubstitute: {
        ...this.state.newSubstitute,
        playerOut: event.currentTarget.attributes[2].value,
        playerOutId: event.currentTarget.attributes[3].value,
    }})
  }

  private dragPlayerLeave = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    this.setState({ newSubstitute: {...this.state.newSubstitute, playerOut: undefined, playerOutId: undefined}})
  }

  private addSubstitute = (): void => {
    const { openSubstitutes, newSubstitute } = this.state;
    const { playerListLatest } = this.props.playerState;

    let updatedOpenSubstitutes;
    if (newSubstitute && newSubstitute.playerIn && newSubstitute.playerOut && playerListLatest.type === 'loaded') {
      

      updatedOpenSubstitutes = [...openSubstitutes, newSubstitute];
    } else {
      updatedOpenSubstitutes = openSubstitutes;
    }
    this.setState({ openSubstitutes: updatedOpenSubstitutes, newSubstitute: undefined})
  }

  private checkOpenSubstitutes = (): boolean => {
    return this.state.openSubstitutes.length === 0;
  }

  private checkOpenTransfers = (): boolean => {
    return this.state.openTransfers.length === 0;
  }

  private resetChanges = (): void => {
    this.setState({ openTransfers: [], openSubstitutes: [] })
  }

  private confirmSubstitutesToggle = (): void => {
    this.setState({ confirmSubstitutes: !this.state.confirmSubstitutes })
  }

  private confirmTransfersToggle = (): void => {
    this.setState({ confirmTransfers: !this.state.confirmTransfers })
  }

  private setSelectedPlayer = (player_id: number, team_side: Position): void => {
    this.setState({selectedPlayerDetails: player_id, playerDetailsDrawerSide: team_side})
  } 

  private stat(name: string, value: number[]) {
    return (
      <div className='stat-box'>
        <div className='stat-element'> {name}</div>
        <Divider className='stat-divider'/>
        <div className='stat-element'> {value.join(' / ')}</div>
      </div>
    )

  }

  private handleSelectPlayer = (selectedPlayer: IPlayer, side: Position) => {
    if (side === Position.LEFT) {
      this.setState({comparePlayerSelectedLeft: selectedPlayer.id})
    } else {
      this.setState({comparePlayerSelectedRight: selectedPlayer.id})
    }
  }

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() {
    const { pickedTeam, selectedTeam, highestTeamThis, highestTeamNext, playerState } = this.props;
    const { selectedPlayerDetails, playerDetailsDrawerSide, suggestedTransfers } = this.state;

    const playerSelected = playerState.playerListLatest.type === 'loaded' && playerState.playerListLatest.value.filter((player) => player.id === selectedPlayerDetails)[0]

    const tabIdToComponentMap: IStringFunctionMap = {
      "current": () => this.compareTeams(pickedTeam, highestTeamThis, "event_points"),
      "next": () => this.compareTeams(selectedTeam, highestTeamNext, 'cost'),
    }

    return (
      <div className='player-analysis-tabs'>
        <Dialog
          className={'changes-overlay bp3-dark'}
          isOpen={this.state.confirmSubstitutes}
          onClose={() => this.confirmSubstitutesToggle()}>
          Substitutes contents...
        </Dialog>
        <Drawer
          className="selected-player-drawer"
          title={'Player Information: ' + (playerSelected ? (playerSelected.web_name) : '')}
          isOpen={selectedPlayerDetails !== undefined}
          onClose={() => this.setState({selectedPlayerDetails: undefined})}
          canOutsideClickClose={true}
          isCloseButtonShown={true} 
          position={playerDetailsDrawerSide}
          size={Drawer.SIZE_LARGE}>
            <PlayerDetails player_id={selectedPlayerDetails ? selectedPlayerDetails.toString() : ''} gameweek={this.props.gameweekInfo}/>
        </Drawer>
        <Tabs
          animate={true}
          renderActiveTabPanelOnly={true}
          id="MainTabs"
          large={true}
          onChange={this.handleNavbarTabChange}
          selectedTabId={this.state.navbarTabId}
          vertical={false}>
          <Tabs.Expander />
          <Tab id="current" title="Current Points" />
          <Tab id="next" title="Next Game Week" />
        </Tabs>
        <div className='tab-container'>
          {pickedTeam.type === 'loaded' ? tabIdToComponentMap[this.state.navbarTabId.toString()]() : <NonIdealState className="graph-non-ideal-state" title="Loading Teams..." description="Getting your teams!" />}
        </div>
        <div className='transfer-list-container'>
          <div className='transfer-list-header'>
                <Text>Actions</Text>
                <Text>Player In</Text>
                <Text>Player Out</Text>
                <Text>Expected Points Gain</Text>
                <Text>Transfer Cost</Text>
          </div>
          <div className='transfer-list'>
            {suggestedTransfers.type === 'loaded' && suggestedTransfers.value.map((transfer) => {
              return (
                <div className='transfer'>
                  <Button className='transfer-compare-players-button' intent='primary' onClick={() => this.comparePlayersDrawerOpen(transfer.id_player_out, transfer.id_player_in)}> Compare Players </Button>
                  <Text>{transfer.web_name_player_out}</Text>
                  <Text>{transfer.web_name_player_in}</Text>
                  <Tag large round intent={transfer.points_gain >= 4 ? Intent.SUCCESS : transfer.points_gain >= 0 ? Intent.PRIMARY : Intent.WARNING}>{transfer.points_gain}</Tag>
                  <Tag large round intent={transfer.transfer_cost <= 0 ? Intent.SUCCESS : transfer.points_gain <= 0.5 ? Intent.PRIMARY : Intent.WARNING}>{transfer.transfer_cost}</Tag>
                </div>
              )
            })}
          </div>
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