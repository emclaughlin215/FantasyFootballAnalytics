import { Position, Button, Divider, Alert, Dialog, H3, H2, Intent, Icon } from "@blueprintjs/core";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { IDisplayTeam, IDisplayPlayer, IPlayer, IGameweekInfo } from "../index.d";
import { IPlayerReducer } from "../reducers/PlayerReducers";
import { ICombinedReducers } from "../reducers/Reducers";
import { LoadState } from "../utils/LoadState";
import { prop } from "../utils/TypeScript";
import { DisplayTeam } from "./DisplayTeam";
import { setSelectedTeam } from '../actions/PlayerActions';


interface ProposedChangePlayer {
    position: string;
    playerId: string;
    playerSide: Position;
}

type ChangePlayerType = 'in' | 'out';

type PlayerChangeMap = {
    [key in ChangePlayerType]?: IDisplayPlayer
}

type ProposedChange = {
    [key in ChangePlayerType]?: ProposedChangePlayer;
};

interface CaptainChange extends PlayerChangeMap {
  type?: 'captain' | 'vice';
}

interface CompareTeamsOwnProps {
    myTeam: LoadState<IDisplayTeam>,
    highestTeam: LoadState<IDisplayTeam>,
    pointsType: keyof IDisplayPlayer;
    comparePlayersDrawerIsOpen: boolean;
    comparePlayerSelectedLeft?: IDisplayPlayer;
    comparePlayerSelectedRight?: IDisplayPlayer;
    gameweekInfo: LoadState<IGameweekInfo>;
    comparePlayersDrawerOpenCallback: CallableFunction;
    setSelectedPlayerCallback: CallableFunction;
}

interface ComapreTeamsStateProps {
    playerState: IPlayerReducer,
    setSelectedTeam: typeof setSelectedTeam,
  }
  
type CompareTeamsProps = CompareTeamsOwnProps & ComapreTeamsStateProps;

interface CompareTeamsState {
    alert?: string,
    newChange?: ProposedChange;
    newCaptainChange?: CaptainChange;
    captainChange?: CaptainChange;
    viceCaptainChange?: CaptainChange;
    copySelectedTeam?: LoadState<IDisplayTeam>;
    playerDetailsDrawIsOpen: boolean;
    openTransfers: PlayerChangeMap[];
    openSubstitutes: PlayerChangeMap[];
    confirmTransfers: boolean;
    confirmTeamChanges: boolean;
}

class CompareTeams extends React.PureComponent<CompareTeamsProps, CompareTeamsState> {
    constructor(props: CompareTeamsProps) {
        super(props);
        this.state = {
            playerDetailsDrawIsOpen: false,
            openTransfers: [],
            openSubstitutes: [],
            confirmTransfers: false,
            confirmTeamChanges: false,
        }
    }

    private checkOpenTransfers = (): boolean => {
        return this.state.openTransfers.length === 0;
    }
    
    private checkOpenSubstitutes = (): boolean => {
      return this.state.openSubstitutes.length === 0;
    }

    private checkCaptainChange = (): boolean => {
      return this.state.captainChange === undefined && this.state.viceCaptainChange === undefined;
    }
  
    private resetChanges = (copySelectedTeam: LoadState<IDisplayTeam>): void => {

      if (copySelectedTeam !== undefined && copySelectedTeam.type === 'loaded') {
        setSelectedTeam(copySelectedTeam.value);
      }

      this.setState({
        openTransfers: [],
        openSubstitutes: [],
        captainChange: undefined,
        viceCaptainChange: undefined,
      })
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

    private dragPlayerStart = (event: React.DragEvent<HTMLDivElement>, playerSide: Position): void => {
      this.setState({
        newChange: {
          ...this.state.newChange,
          out: {
            position: event.currentTarget.attributes[2].value,
            playerId: event.currentTarget.attributes[3].value,
            playerSide: playerSide,
          }
      }})
    }
  
    private dragPlayerOver = (event: React.DragEvent<HTMLDivElement>, playerSide: Position): void => {
      event.preventDefault();
      this.setState({
        newChange: {
          ...this.state.newChange,
          in: {
            position: event.currentTarget.attributes[2].value,
            playerId: event.currentTarget.attributes[3].value,
            playerSide: playerSide,
          }
      }})
    }
  
    private dragPlayerLeave = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      this.setState({ newChange: {...this.state.newChange, in: undefined}})
    }

    private addTransfer = (): void => {
      const { newChange, openTransfers } = this.state;
      const { playerListLatest } = this.props.playerState;
  
      const changePlayers: PlayerChangeMap = this.getNewChangePlayers(newChange, playerListLatest);
  
      let updatedOpenTransfers;
      if (newChange && changePlayers.in && changePlayers.out && changePlayers.in.element_name && changePlayers.out.element_name) {
        if (changePlayers.in.element_name === changePlayers.out.element_name) {
          updatedOpenTransfers = [...openTransfers, changePlayers];
        } else {
          this.openAlert('Transfer must be two players of the same position.');
          updatedOpenTransfers = openTransfers;
        }
      } else {
        updatedOpenTransfers = openTransfers;
      }
      this.setState({ openTransfers: updatedOpenTransfers, newChange: undefined})
    }
  
    private addSubstitute = (): void => {
      const { newChange, openSubstitutes } = this.state;
      const { setSelectedTeam } = this.props;
      const { playerListLatest, selectedTeam } = this.props.playerState;

      const changePlayers: PlayerChangeMap = this.getNewChangePlayers(newChange, playerListLatest);

      let updatedOpenSubstitutes;
      if (newChange && newChange.in && newChange.out && newChange.in.position && newChange.out.position) {
        const posIn: number = parseInt(newChange.in.position);
        const posOut: number = parseInt(newChange.out.position);
        if ((posIn > 11 || posOut > 11) && (selectedTeam.type === 'loaded')) {
          
          // TODO: Make this substitute change in the view live. 
          const playerA: IDisplayPlayer = selectedTeam.value.team[posIn];
          const playerB: IDisplayPlayer = selectedTeam.value.team[posOut];
          selectedTeam.value.team[posIn] = playerB;
          selectedTeam.value.team[posOut] = playerA;
          setSelectedTeam(selectedTeam.value);

          updatedOpenSubstitutes = [...openSubstitutes, changePlayers];
        } else {
          this.openAlert('Substitute must include one player on the bench.');
          updatedOpenSubstitutes = openSubstitutes;
        }
      } else {
        updatedOpenSubstitutes = openSubstitutes;
      }
      this.setState({ openSubstitutes: updatedOpenSubstitutes, newChange: undefined})
    }
  
    private addChange = (): void => {
      const { newChange } = this.state;
      if (newChange && newChange.in && newChange.out && !this.state.newCaptainChange) {
        if (newChange.in.playerSide && newChange.out.playerSide && newChange.in.playerSide === newChange.out.playerSide) {
          this.addSubstitute();
        } else {
          this.addTransfer();
        }
      }
    }

    private dragCaptainStart = (event: React.DragEvent<HTMLDivElement>, type: ('captain' | 'vice')): void => {
      const { selectedTeam } = this.props.playerState;
      selectedTeam.type === 'loaded' &&
      this.setState({
        newCaptainChange: {
          type,
          out: selectedTeam.value.team[parseInt(event.currentTarget.attributes[2].value)] as IPlayer,
        }
      })
    }
  
    private dragCaptainOver = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      const { selectedTeam } = this.props.playerState;
      selectedTeam.type === 'loaded' &&
      this.setState({
        newCaptainChange: {
          ...this.state.newCaptainChange,
          in: selectedTeam.value.team[parseInt(event.currentTarget.attributes[2].value)] as IPlayer,
        }
      })
    }
  
    private dragCaptainLeave = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      this.setState({ newCaptainChange: {...this.state.newCaptainChange, in: undefined}})
    }

    private dragCaptainDrop = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();

      const { selectedTeam } = this.props.playerState;
      const { newCaptainChange } = this.state;

      if (newCaptainChange === undefined || selectedTeam.type === 'loading') {
        return;
      } else if (newCaptainChange.in === undefined || newCaptainChange.out === undefined) {
        return;
      }

      const outPos: number = newCaptainChange.out.position;
      const inPos: number = newCaptainChange.in.position;
      
      if (newCaptainChange.type === 'captain') {
        selectedTeam.value.team[inPos].is_captain = true;
        selectedTeam.value.team[outPos].is_captain = false;
        if (selectedTeam.value.team[inPos].is_vice_captain === true) {
          // TODO: Swapping vice cap and cap as the second change of either breaks this!!
          selectedTeam.value.team[inPos].is_vice_captain = false;
          selectedTeam.value.team[outPos].is_vice_captain = true;
        }
        if (this.state.captainChange !== undefined) {
          newCaptainChange.out = this.state.captainChange.out;
        }
        this.setState({
          captainChange: newCaptainChange,
          newCaptainChange: undefined,
        })
      } else if (newCaptainChange.type === 'vice' ) {
        selectedTeam.value.team[inPos].is_vice_captain = true;
        selectedTeam.value.team[outPos].is_vice_captain = false;
        if (selectedTeam.value.team[inPos].is_captain === true) {
          selectedTeam.value.team[inPos].is_captain = false;
          selectedTeam.value.team[outPos].is_captain = true;
        }
        if (this.state.viceCaptainChange !== undefined) {
          newCaptainChange.out = this.state.viceCaptainChange.out;
        }
        this.setState({
          viceCaptainChange: newCaptainChange,
          newCaptainChange: undefined,
        })
      }
      setSelectedTeam(selectedTeam.value);
    }

    private openAlert = (alert: string) => {
      this.setState({ alert })
    }

    private confirmTeamChangesToggle = (): void => {
      this.setState({ confirmTeamChanges: !this.state.confirmTeamChanges })
    }
  
    private confirmTransfersToggle = (): void => {
      this.setState({ confirmTransfers: !this.state.confirmTransfers })
    }
  
    private displayTransfers = () => {
      const transfers: PlayerChangeMap[] = this.state.openTransfers;
      return (
        <div className='preview-transfers-container'>
          <H2>Transfers</H2>
          <div className='preview-transfers'>
          <H3><Icon icon='import' intent={Intent.SUCCESS}></Icon></H3> <H3><Icon icon='export' intent={Intent.DANGER}></Icon></H3> <H3>£ +/-</H3> <H3>Points +/-</H3> <H3>Points Used</H3>
            {transfers.map((transfer: PlayerChangeMap, idx: number) => {
              return <><div>{transfer.in?.web_name}</div> <div>{transfer.out?.web_name}</div> <div>{24}</div> <div>7.6</div> <div>{idx * 4}</div></>
            })}
          </div>
          <div className='flex-grow'></div>
          <div className='play-token-buttons'>
            <Button className='token-button' intent={Intent.PRIMARY} large={true}>Wildcard</Button>
            <Button className='token-button' intent={Intent.PRIMARY} large={true}>Free Hit</Button>
            <Button className='token-button' intent={Intent.SUCCESS} large={true}>Confirm</Button>
          </div>
        </div>
      )
    }

    private displayTeamChange = <T extends PlayerChangeMap>(header: string, changes: (T[]))=> {
      return (
        <div className='preview-team-change-container'>
          <H2>{header}</H2>
          <div className='preview-team-change'>
            <H3><Icon icon='import' intent={Intent.SUCCESS}></Icon></H3> <H3><Icon icon='export' intent={Intent.DANGER}></Icon></H3> <H3>Points +/-</H3>
            {changes.map((change: (T)) => {
              return <><div>{change.in?.web_name}</div> <div>{change.out?.web_name}</div> <div>7.6</div></>
            })}
          </div>
        </div>)
    }

    private displayTeamChanges = () => {
      const changes: PlayerChangeMap[] = this.state.openSubstitutes;
      const captainChange: CaptainChange | undefined = this.state.captainChange;
      const viceCaptainChange: CaptainChange | undefined = this.state.viceCaptainChange;
      return (
        <div className='preview-team-changes'>
          {this.displayTeamChange('Substitutes', changes)}
          <div className='preview-captain-changes'>
            {captainChange && this.displayTeamChange('Captain', [captainChange])}
            {viceCaptainChange && this.displayTeamChange('Vice Captain', [viceCaptainChange])}
          </div>
          <div className='flex-grow'></div>
          <div className='play-token-buttons'>
            <Button className='token-button' intent={Intent.SUCCESS} large={true}>Confirm</Button>
          </div>
        </div>
      )
    }
  
    private getNewChangePlayers(newChange: ProposedChange | undefined, playerListLatest: LoadState<IPlayer[]>): PlayerChangeMap {
      let changePlayers: PlayerChangeMap = {};
      playerListLatest.type === 'loaded' && newChange && playerListLatest.value.forEach((pl) => {
          if (newChange.in && newChange.out) {
              let playerSub; let playerFirstTeam;
              if (newChange.in.position > newChange.out.position) {
                  playerSub = newChange.out.playerId;
                  playerFirstTeam = newChange.in.playerId;
              } else {
                  playerSub = newChange.in.playerId;
                  playerFirstTeam = newChange.out.playerId;          
              }
              if (playerSub && (pl.id.toString() === playerSub)) {
                  changePlayers.in = pl;
              } else if (playerFirstTeam && (pl.id.toString() === playerFirstTeam)) {
                  changePlayers.out = pl;
              }
          }
      })
      return changePlayers;
    }

    private pointsTypeMap: {[key: string]: {[vkey: string]: Function}} = {
      'event_points': {
        'setSelectPlayer': this.props.setSelectedPlayerCallback,
        'dragPlayerStart': () => null,
        'dragPlayerOver': () => null,
        'dragPlayerLeave': () => null,
        'makeSubstitute': () => null,
        'dragCaptainStart': () => null,
        'dragCaptainOver': () => null,
        'dragCaptainLeave': () => null,
        'dragCaptainDrop': () => null,
      },
      'cost': {
        'setSelectPlayer': this.props.setSelectedPlayerCallback,
        'dragPlayerStart': this.dragPlayerStart,
        'dragPlayerOver': this.dragPlayerOver,
        'dragPlayerLeave': this.dragPlayerLeave,
        'makeSubstitute': () => this.addChange(),
        'dragCaptainStart': this.dragCaptainStart,
        'dragCaptainOver': this.dragCaptainOver,
        'dragCaptainLeave': this.dragCaptainLeave,
        'dragCaptainDrop': this.dragCaptainDrop,
      }
    }

    render() {
        const { pointsType, myTeam, highestTeam} = this.props;

        const copySelectedTeam: LoadState<IDisplayTeam> = this.props.playerState.selectedTeam;
        
        return (
        <div className='compare-teams-container'>
          <Alert className='bp3-dark' isOpen={this.state.alert !== undefined} confirmButtonText='Close' onClose={() => this.setState({ alert: undefined })}>
              <p>{this.state.alert}</p>
          </Alert>
          <Dialog
              className={'changes-overlay bp3-dark'}
              isOpen={this.state.confirmTransfers}
              onClose={() => this.confirmTransfersToggle()}>
              {this.displayTransfers()}
          </Dialog>
          <Dialog
              className={'changes-overlay bp3-dark'}
              isOpen={this.state.confirmTeamChanges}
              onClose={() => this.confirmTeamChangesToggle()}>
              {this.displayTeamChanges()}
          </Dialog>
          <div className='play-token-buttons'>
            <Button className='token-button' intent={Intent.PRIMARY} large={true}>Triple Captain</Button>
            <Button className='token-button' intent={Intent.PRIMARY} large={true}>Free Hit</Button>
            <Button className='token-button' intent={Intent.PRIMARY} large={true}>Bench Boost</Button>
          </div>
          <div className='team-config-buttons-wrapper'>
              <Button className='team-config-button' intent='primary' onClick={() => this.props.comparePlayersDrawerOpenCallback(myTeam, highestTeam)}> Compare Players </Button>
              {pointsType === 'cost' && (
              <>
                  <Button className='team-config-button' intent='success' disabled={this.checkOpenSubstitutes() && this.checkCaptainChange()} onClick={() => this.confirmTeamChangesToggle()}>
                  Confirm Team Changes </Button>
                  <Button className='team-config-button' intent='success' disabled={this.checkOpenTransfers()} onClick={() => this.confirmTransfersToggle()}>
                  Confirm Transfers </Button>
                  <Button className='team-config-button' intent='warning' disabled={this.checkOpenTransfers() && this.checkOpenSubstitutes() && this.checkCaptainChange()} onClick={() => this.resetChanges(copySelectedTeam)}>
                  Reset</Button>
              </>)}
          </div>
          <div className='body-container'>
              <div className='pitches_container'>
              {[myTeam, highestTeam].map((team, index) => {
                  const teamSide: Position = index === 0 ? Position.LEFT : Position.RIGHT;
                  const points = team.type === 'loaded' ? pointsType === 'event_points' ? prop(team.value, 'actual_points') : prop(team.value, 'expected_points') : 0;
                  return (
                  team.type === 'loaded' && typeof points === 'number' &&
                  <div>
                      <div className='team-layout'>
                      {DisplayTeam(
                          team.value,
                          teamSide,
                          this.pointsTypeMap[pointsType]['setSelectPlayer'],
                          this.pointsTypeMap[pointsType]['dragPlayerStart'],
                          this.pointsTypeMap[pointsType]['dragPlayerOver'],
                          this.pointsTypeMap[pointsType]['dragPlayerLeave'],
                          this.pointsTypeMap[pointsType]['makeSubstitute'],
                          this.pointsTypeMap[pointsType]['dragCaptainStart'],
                          this.pointsTypeMap[pointsType]['dragCaptainOver'],
                          this.pointsTypeMap[pointsType]['dragCaptainLeave'],
                          this.pointsTypeMap[pointsType]['dragCaptainDrop'],
                          pointsType)}
                      </div>
                      <div className='team-stats'>
                      {this.stat('Cost', [team.value.cost])}
                      {pointsType === 'event_points' ?
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
}


const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      setSelectedTeam,
    },
    dispatch,
  );
};

const mapStateToProps = (state: ICombinedReducers) => {
    return {
      playerState: state.PlayerReducer,
    };
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(CompareTeams);