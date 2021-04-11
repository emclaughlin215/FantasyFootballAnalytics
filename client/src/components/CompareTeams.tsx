import { Position, Button, Alert, Dialog, H3, H2, Intent, Icon, Divider, H4 } from "@blueprintjs/core";
import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { IDisplayTeam, IDisplayPlayer, IPlayer, IGameweekInfo, ISubmitTeam, ISubmitPlayer, IMetadata, IChipsMetadata, ITransfersMetadata, ISubmitTransfers, ISubmitTransfer } from "../index.d";
import { ICombinedReducers } from "../reducers/Reducers";
import { getIfLoadedOrElse, LoadState } from "../utils/LoadState";
import { prop } from "../utils/TypeScript";
import { DisplayTeam } from "./DisplayTeam";
import { getNumericDiff, getOrZero, stat } from "../utils/Number";
import { getSelectedTeam } from "../actions/PlayerActions";
import { max, round } from "lodash";
import { chipIsBeingUsed, maybeChipButton } from "../utils/ChipUtils";

interface ProposedChangePlayer {
  position: string;
  playerId: string;
  playerSide: Position;
}

type ChangePlayerType = 'currentlyIn' | 'currentlyOut';

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
    myTeam: IDisplayTeam,
    highestTeam: IDisplayTeam,
    pointsType: keyof IDisplayPlayer;
    comparePlayersDrawerIsOpen: boolean;
    comparePlayerSelectedLeft?: IDisplayPlayer;
    comparePlayerSelectedRight?: IDisplayPlayer;
    gameweekInfo: LoadState<IGameweekInfo>;
    comparePlayersDrawerOpenCallback: CallableFunction;
    setSelectedPlayerCallback: CallableFunction;
}

interface ComapreTeamsStateProps {
    selectedTeam: LoadState<IDisplayTeam>,
    playerListLatest: LoadState<IPlayer[]>,
    getSelectedTeam: typeof getSelectedTeam,
  }
  
type CompareTeamsProps = CompareTeamsOwnProps & ComapreTeamsStateProps;

interface CompareTeamsState {
    alert?: string,
    newChange?: ProposedChange;
    newCaptainChange?: CaptainChange;
    captainChange?: CaptainChange;
    viceCaptainChange?: CaptainChange;
    playerDetailsDrawIsOpen: boolean;
    openTransfers: PlayerChangeMap[];
    openSubstitutes: PlayerChangeMap[];
    confirmTransfers: boolean;
    confirmTeamChanges: boolean;
    useWildcardChip: boolean;
    useTripleCaptainChip: boolean;
    useFreehitChip: boolean;
    useBenchboostChip: boolean;
    wildcardChip?: IChipsMetadata;
    tripleCaptainChip?: IChipsMetadata;
    freehitChip?: IChipsMetadata;
    benchboostChip?: IChipsMetadata;
    transfersMetadata?: ITransfersMetadata;
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
            useWildcardChip: false,
            useTripleCaptainChip: false,
            useFreehitChip: false,
            useBenchboostChip: false,
        }
    }

    async componentDidMount() {

      // Handle Metadata
      const metadata: Response = await fetch('http://localhost:8000/metadata/');
      const metadataJson: IMetadata = await metadata.json();
      let wildcardChip: IChipsMetadata | undefined = undefined;
      let tripleCaptainChip: IChipsMetadata | undefined = undefined;
      let freehitChip: IChipsMetadata | undefined = undefined;
      let benchboostChip: IChipsMetadata | undefined = undefined;
      if (metadataJson !== null) {
        const chips = metadataJson.chips;
        chips.forEach(chip => {
          switch (chip.name) {
            case '3xc': {
              tripleCaptainChip = chip;
              break;
            }
            case 'bboost': {
              benchboostChip = chip;
              break;
            }
            case 'freehit': {
              freehitChip = chip;
              break;
            }
            case 'wildcard': {
              wildcardChip = chip;
              break;
            }
          }
        })
      }
      const transfersMetadata = metadataJson.transfers;
      this.setState({tripleCaptainChip, benchboostChip, freehitChip, wildcardChip, transfersMetadata})
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

    private clearPendingChanges = (): void => {
      this.setState({
        openTransfers: [],
        openSubstitutes: [],
        captainChange: undefined,
        viceCaptainChange: undefined,
      })
    }
  
    private resetChanges = (): void => {
      this.props.getSelectedTeam("http://localhost:8000/expectedPoints/selected");
      this.clearPendingChanges();
    }

    private dragPlayerStart = (event: React.DragEvent<HTMLDivElement>, playerSide: Position): void => {
      this.setState({
        newChange: {
          ...this.state.newChange,
          currentlyIn: {
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
          currentlyOut: {
            position: event.currentTarget.attributes[2].value,
            playerId: event.currentTarget.attributes[3].value,
            playerSide: playerSide,
          }
      }})
    }
  
    private dragPlayerLeave = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      this.setState({ newChange: {...this.state.newChange, currentlyOut: undefined}})
    }

    private addTransfer = (newChange: ProposedChange, tempSelectedTeam: IDisplayTeam, changePlayers: PlayerChangeMap): void => {
      const { openTransfers } = this.state;
  
      let newCaptainChange: CaptainChange | undefined = undefined;
      let updatedOpenTransfers = [...openTransfers];
      if (newChange && newChange.currentlyOut && changePlayers.currentlyIn && changePlayers.currentlyOut) {
        if (changePlayers.currentlyIn.element_name !== changePlayers.currentlyOut.element_name) {
          this.openAlert('Transfer must be two players of the same position.');
          return;
        } else if (changePlayers.currentlyIn.web_name === changePlayers.currentlyOut.web_name) {
          this.openAlert('Transfer must involve two different players.');
          return;
        } else {
          // check if the transfer includes a captain
          if (changePlayers.currentlyOut.is_captain) {
            changePlayers.currentlyOut.is_captain = !changePlayers.currentlyOut.is_captain;
            changePlayers.currentlyIn.is_captain = !changePlayers.currentlyIn.is_captain;
            newCaptainChange = {
              type: 'captain',
              currentlyIn: changePlayers.currentlyIn,
              currentlyOut: changePlayers.currentlyOut,
            }
            if (this.state.captainChange !== undefined) {
              newCaptainChange.currentlyOut = this.state.captainChange.currentlyOut;
            }
          } else if (changePlayers.currentlyOut.is_vice_captain) {
            changePlayers.currentlyOut.is_vice_captain = !changePlayers.currentlyOut.is_vice_captain;
            changePlayers.currentlyIn.is_vice_captain = !changePlayers.currentlyIn.is_vice_captain;
            newCaptainChange =  {
              type: 'vice',
              currentlyIn: changePlayers.currentlyIn,
              currentlyOut: changePlayers.currentlyOut,
            }
            if (this.state.viceCaptainChange !== undefined) {
              newCaptainChange.currentlyOut = this.state.viceCaptainChange.currentlyOut;
            }
          }

          const posOut: number = parseInt(newChange.currentlyOut.position);
          tempSelectedTeam.team[posOut] = {...changePlayers.currentlyOut};
          tempSelectedTeam.team[posOut].position = posOut;
          updatedOpenTransfers = [...updatedOpenTransfers, changePlayers];
        }
      }
      this.setState({ openTransfers: updatedOpenTransfers, newChange: undefined, newCaptainChange: newCaptainChange || this.state.newCaptainChange })
    }
  
    private addSubstitute = (newChange: ProposedChange, tempSelectedTeam: IDisplayTeam, changePlayers: PlayerChangeMap): void => {
      const { openSubstitutes } = this.state;

      let updatedOpenSubstitutes = [...openSubstitutes];
      let newCaptainChange: CaptainChange | undefined = undefined;

      if (newChange && newChange.currentlyIn && newChange.currentlyOut && newChange.currentlyIn.position && newChange.currentlyOut.position) {
        let posIn: number = parseInt(newChange.currentlyIn.position);
        const posOut: number = parseInt(newChange.currentlyOut.position);
        if ((posIn > 11 || posOut > 11)) {
          
          const playerA: IDisplayPlayer = tempSelectedTeam.team[posIn];
          const playerB: IDisplayPlayer = tempSelectedTeam.team[posOut];
          playerA.position = posOut;
          tempSelectedTeam.team[posOut] = playerA;

          // insert player in the correct position to be shown on the field.
          playerB.position = posIn;
          tempSelectedTeam.team[posIn] = playerB;
          while ((posIn - 1 > 0) && (playerB.element_type < tempSelectedTeam.team[posIn - 1].element_type)) {
            tempSelectedTeam.team[posIn] = tempSelectedTeam.team[posIn - 1];
            tempSelectedTeam.team[posIn].position = posIn;
            tempSelectedTeam.team[posIn - 1] = playerB;
            tempSelectedTeam.team[posIn - 1].position = posIn - 1;
            posIn -= 1;
          }
          while ((posIn + 1 < 12) && (playerB.element_type > tempSelectedTeam.team[posIn + 1].element_type)) {
            tempSelectedTeam.team[posIn] = tempSelectedTeam.team[posIn + 1];
            tempSelectedTeam.team[posIn].position = posIn;
            tempSelectedTeam.team[posIn + 1] = playerB;
            tempSelectedTeam.team[posIn + 1].position = posIn + 1;
            posIn += 1;
          }

          // check if the substitute includes a captain
          if (playerB.is_captain) {
            playerB.is_captain = !playerB.is_captain;
            playerA.is_captain = !playerA.is_captain;
            newCaptainChange = {
              type: 'captain',
              currentlyIn: playerA,
              currentlyOut: playerB,
            }
            if (this.state.captainChange !== undefined) {
              newCaptainChange.currentlyOut = this.state.captainChange.currentlyOut;
            }
          } else if (playerB.is_vice_captain) {
            playerB.is_vice_captain = !playerB.is_vice_captain;
            playerA.is_vice_captain = !playerA.is_vice_captain;
            newCaptainChange =  {
              type: 'vice',
              currentlyIn: playerA,
              currentlyOut: playerB,
            }
            if (this.state.viceCaptainChange !== undefined) {
              newCaptainChange.currentlyOut = this.state.viceCaptainChange.currentlyOut;
            }
          }

          updatedOpenSubstitutes = [...updatedOpenSubstitutes, changePlayers];
        } else {
          this.openAlert('Substitute must include one player on the bench.');
        }
      }
      this.setState({ openSubstitutes: updatedOpenSubstitutes, newChange: undefined, newCaptainChange: newCaptainChange || this.state.newCaptainChange })
    }
  
    private addChange = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();

      const { newChange } = this.state;
      const { myTeam, highestTeam } = this.props;

      const selectedPlayers: IDisplayPlayer[] = Object.values(myTeam.team);
      const highestPlayers: IDisplayPlayer[] = Object.values(highestTeam.team);
      const changePlayers: PlayerChangeMap = this.getNewChangePlayers(newChange, selectedPlayers, highestPlayers);

      if (newChange && newChange.currentlyIn && newChange.currentlyOut && !this.state.newCaptainChange?.currentlyIn) {
        if (newChange.currentlyIn.playerId === newChange.currentlyOut.playerId) {
          return;
        }
        if (newChange.currentlyIn.playerSide && newChange.currentlyOut.playerSide && newChange.currentlyIn.playerSide === newChange.currentlyOut.playerSide) {
          if (!this.validateSubstitute(changePlayers, myTeam)) {
            return;
          }
          this.addSubstitute(newChange, myTeam, changePlayers);
        } else {
          if (!this.validateTransfer(changePlayers, myTeam)) {
            return;
          }
          this.addTransfer(newChange, myTeam, changePlayers);
        }
      }
    }

    private validateTransfer(changePlayers: PlayerChangeMap, team: IDisplayTeam): boolean {

      if (!(changePlayers.currentlyIn && changePlayers.currentlyOut)) {
        return false;
      }
      const playerInId: number = changePlayers.currentlyOut.id;
      const teamPlayerIds: number[] = Object.values(team.team).map(pl => pl.id);
      if (teamPlayerIds.indexOf(playerInId) >= 0) {
        this.setState({alert: 'The player being transferred in must not already be in your squad.'});
        return false;
      }
      return true;
    }

    private validateSubstitute(changePlayers: PlayerChangeMap, team: IDisplayTeam): boolean {

      if (((changePlayers.currentlyIn?.element_type === 1) && (changePlayers.currentlyOut?.element_type !== 1)) ||
          ((changePlayers.currentlyIn?.element_type !== 1) && (changePlayers.currentlyOut?.element_type === 1))) {
            this.setState({alert: 'Goalkeepers can only be substituted with another goalkeeper.'})
            return false;
      }

      let positionCounts: {[key: number]: number} = Object.values(team.team).map(pl => pl.element_type).reduce(function (acc, curr, idx) {
        if (idx >= 11) return acc
        if (typeof acc[curr] == 'undefined') {
          acc[curr] = 1;
        } else {
          acc[curr] += 1;
        }
      
        return acc;
      }, {} as {[key: number]: number});

      if (changePlayers.currentlyIn && changePlayers.currentlyOut) {
          const playerInType: number = changePlayers.currentlyIn.element_type;
          const playerOutType: number = changePlayers.currentlyOut.element_type;
    
          positionCounts[playerInType] += 1;
          positionCounts[playerOutType] -= 1;
      }
      if ((positionCounts[2] <= 2) || (positionCounts[3] <= 2) || (positionCounts[4] < 1)) {
        this.setState({alert: 'You must have at least 3 Defenders, 3 Midfielders and 1 Striker.'});
        return false;
      }
      return true;
    }

    private dragCaptainStart = (event: React.DragEvent<HTMLDivElement>, type: ('captain' | 'vice')): void => {
      const { myTeam } = this.props;
      this.setState({
        newCaptainChange: {
          type,
          currentlyOut: myTeam.team[parseInt(event.currentTarget.attributes[2].value)] as IDisplayPlayer,
        }
      })
    }
  
    private dragCaptainOver = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      const { myTeam } = this.props;
      this.setState({
        newCaptainChange: {
          ...this.state.newCaptainChange,
          currentlyIn: myTeam.team[parseInt(event.currentTarget.attributes[2].value)] as IDisplayPlayer,
        }
      })
    }
  
    private dragCaptainLeave = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      this.setState({ newCaptainChange: {...this.state.newCaptainChange, currentlyIn: undefined}})
    }

    private dragCaptainDrop = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();

      const { myTeam } = this.props;
      const { newCaptainChange } = this.state;

      if (newCaptainChange === undefined) {
        return;
      }
      
      if (newCaptainChange.currentlyIn === undefined || newCaptainChange.currentlyOut === undefined) {
        return;
      }

      let myTeamTemp: IDisplayTeam = {...myTeam};

      const outPos: number = newCaptainChange.currentlyOut.position;
      const inPos: number = newCaptainChange.currentlyIn.position;

      if (inPos > 11 || outPos > 11) {
        this.setState({alert: 'You cannot set a player on the bench as captain or vice captain.'});
        return;
      }
      
      if (newCaptainChange.type === 'captain') {
        myTeamTemp.team[inPos].is_captain = !myTeamTemp.team[inPos].is_captain;
        myTeamTemp.team[outPos].is_captain = !myTeamTemp.team[outPos].is_captain;
        if ((myTeamTemp.team[inPos].is_vice_captain === true) || (myTeamTemp.team[inPos].is_vice_captain === true)) {
          // TODO: Swapping vice cap and cap as the second change of either breaks this!!
          myTeamTemp.team[inPos].is_vice_captain = !myTeamTemp.team[inPos].is_vice_captain;
          myTeamTemp.team[outPos].is_vice_captain = !myTeamTemp.team[outPos].is_vice_captain;
        }
        if (this.state.captainChange !== undefined) {
            newCaptainChange.currentlyOut = this.state.captainChange.currentlyOut;
        }
        this.setState({
          captainChange: newCaptainChange,
          newCaptainChange: undefined,
        })
      } else if (newCaptainChange.type === 'vice' ) {
        myTeamTemp.team[inPos].is_vice_captain = !myTeamTemp.team[inPos].is_vice_captain;
        myTeamTemp.team[outPos].is_vice_captain = !myTeamTemp.team[outPos].is_vice_captain;
        if ((myTeamTemp.team[inPos].is_captain === true) || (myTeamTemp.team[inPos].is_captain === true)) {
          myTeamTemp.team[inPos].is_captain = !myTeamTemp.team[inPos].is_captain;
          myTeamTemp.team[outPos].is_captain = !myTeamTemp.team[outPos].is_captain;
        }
        if (this.state.viceCaptainChange !== undefined) {
          newCaptainChange.currentlyOut = this.state.viceCaptainChange.currentlyOut;
        }
        this.setState({
          viceCaptainChange: newCaptainChange,
          newCaptainChange: undefined,
        })
      }
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

    private getPenaltyCost(newTransferCount: number): number {
      if (this.state.useWildcardChip || this.state.useFreehitChip || chipIsBeingUsed(this.state.wildcardChip, this.props.gameweekInfo) || chipIsBeingUsed(this.state.freehitChip, this.props.gameweekInfo)) {
        return 0;
      }
      return getOrZero(max([0, (newTransferCount + getOrZero(this.state.transfersMetadata?.made) + 1 - getOrZero(this.state.transfersMetadata?.limit)) * 4]));
    }
  
    private displayTransfers = () => {
      const transfers: PlayerChangeMap[] = this.state.openTransfers;
      let total_points: number = 0;
      let total_cost: number = 0;
      return (
        <div className='preview-transfers-container'>
          <H2>Transfers</H2>
          <div className='preview-transfers'>
            <H3><Icon icon='import' intent={Intent.SUCCESS}></Icon></H3> <H3><Icon icon='export' intent={Intent.DANGER}></Icon></H3> <H3>£ +/-</H3> <H3>Points +/-</H3> <H3>Points Used</H3>
            {transfers.map((transfer: PlayerChangeMap, idx: number) => {
              let points: number = getNumericDiff(transfer.currentlyIn?.ep_next, transfer.currentlyOut?.ep_next); total_points += points;
              let cost: number = getNumericDiff(transfer.currentlyIn?.cost, transfer.currentlyOut?.cost); total_cost += cost;
              let penalty_cost: number = this.getPenaltyCost(idx);
              return <><div>{transfer.currentlyIn?.web_name}</div><div>{transfer.currentlyOut?.web_name}</div><div>{cost}</div><div>{points}</div><div>{penalty_cost}</div></>
            })}
            <p></p><p></p><Divider className='changes-summary-divider'/><Divider className='changes-summary-divider'/><p></p>
            <p></p><p></p><H4>{round(total_cost, 2)}</H4><H4>{round(total_points, 2)}</H4><p></p>
          </div>
          <div className='flex-grow'></div>
          <div className='play-token-buttons'>
            {maybeChipButton(this.state.wildcardChip, 'Wildcard', () => this.setState({useWildcardChip: !this.state.useWildcardChip}), this.state.useWildcardChip, this.props.gameweekInfo)}
            {maybeChipButton(this.state.freehitChip, 'Free Hit', () => this.setState({useFreehitChip: !this.state.useFreehitChip}), this.state.useFreehitChip, this.props.gameweekInfo)}
            <Button className='token-button' intent={Intent.SUCCESS} large={true} onClick={() => this.submitTransfers()}>Confirm</Button>
          </div>
        </div>
      )
    }

    private displayTeamChange = <T extends PlayerChangeMap>(header: ('Substitutes' | 'Captain' | 'Vice Captain'), changes: (T[]))=> {
      return (
        <div className='preview-team-change-container'>
          <H2>{header}</H2>
          <div className='preview-team-change'>
            <H3><Icon icon='import' intent={Intent.SUCCESS}></Icon></H3> <H3><Icon icon='export' intent={Intent.DANGER}></Icon></H3> <H3>Points +/-</H3>
            {changes.map((change: (T)) => {
              return (
                <>
                  <div>{change.currentlyIn?.web_name}</div>
                  <div>{change.currentlyOut?.web_name}</div>
                  <div>{getNumericDiff(change.currentlyIn?.ep_next, change.currentlyOut?.ep_next)}</div>
                </>
              )
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
            <Button className='token-button' intent={Intent.SUCCESS} large={true} onClick={() => this.submitTeamChanges()}>Confirm</Button>
          </div>
        </div>
      )
    }

    private submitTeamChanges = (): void => {
      const { myTeam } = this.props;
      let teamToSubmit: ISubmitTeam = {} as ISubmitTeam;
      teamToSubmit.picks = [];
      teamToSubmit.chip = null;  // this is where wildcard, triple captain etc might be used.
      Object.entries(myTeam.team).map(pl => pl[1]).forEach((pl => {
      const playerToSubmit: ISubmitPlayer = {
          'element': pl.id,
          'position': pl.position,
          'is_captain': pl.is_captain,
          'is_vice_captain': pl.is_vice_captain,
      }   
      teamToSubmit.picks.push(playerToSubmit);
      }))
      this.sendTeamChanges(teamToSubmit);
      this.confirmTeamChangesToggle();
      this.clearPendingChanges(); 
    }

    private sendTeamChanges = async (teamToSubmit: ISubmitTeam) => {
        const res: Response = await fetch('http://localhost:8000/set/teams',{body: JSON.stringify(teamToSubmit), method: 'POST'});
        const submitResponseBody = await res.json();
        const submitResponseStatus: number = res.status;
        if (submitResponseStatus === 200) {
            this.setState({alert: 'Team Changes Submitted: ' + JSON.stringify(submitResponseBody)})
        } else {
            this.setState({alert: 'There was an issue sumbitting the changes.' + JSON.stringify(submitResponseBody)})
        }
    }

    private submitTransfers = (): void => {
      const { openTransfers } = this.state;

      if (openTransfers.length === 0) {
        return;
      }

      let transfersToSubmit: ISubmitTransfers = {} as ISubmitTransfers;
      transfersToSubmit.chip = null;
      transfersToSubmit.entry = null;
      transfersToSubmit.event = getOrZero(getIfLoadedOrElse(this.props.gameweekInfo, {} as IGameweekInfo).next.id);
      transfersToSubmit.transfers = [];
      openTransfers.forEach(transfer => {
        if (transfer.currentlyIn === undefined || transfer.currentlyOut === undefined) {
          return;
        }
        let transferToAdd: ISubmitTransfer = {
          'element_in': transfer.currentlyIn.id,
          'element_out': transfer.currentlyOut.id,
          'purchase_price': transfer.currentlyIn.now_cost,
          'selling_price': transfer.currentlyOut.now_cost,
        };
        transfersToSubmit.transfers.push(transferToAdd);
      })
      this.sendTransferChanges(transfersToSubmit);
      this.confirmTransfersToggle(); 
      this.clearPendingChanges(); 
    }

    private sendTransferChanges = async (transfersToSubmit: ISubmitTransfers) => {
      const res: Response = await fetch('http://localhost:8000/set/transfers',{body: JSON.stringify(transfersToSubmit), method: 'POST'});
      const submitResponseBody = await res.json();
      const submitResponseStatus: number = res.status;
      if (submitResponseStatus === 200) {
          this.setState({alert: 'Transfer Changes Submitted: ' + JSON.stringify(submitResponseBody)})
      } else {
          this.setState({alert: 'There was an issue sumbitting the transfers.' + JSON.stringify(submitResponseBody)})
      }
  }

    private getNewChangePlayers(newChange: ProposedChange | undefined, myTeam: IDisplayPlayer[], highestTeam: IDisplayPlayer[]): PlayerChangeMap {
      let changePlayers: PlayerChangeMap = {};
      if (newChange && newChange.currentlyIn && newChange.currentlyOut) {
        const ids: string[] = [newChange.currentlyIn.playerId, newChange.currentlyOut.playerId];
        const playersToChange = Object.values(myTeam).filter(pl => ids.indexOf(pl.id.toString()) >= 0);
        const playerCurrentlyIn = playersToChange.filter(pl => pl.id.toString() === ids[0])[0] as IDisplayPlayer;
        if (newChange.currentlyIn.playerSide !== newChange.currentlyOut.playerSide) {
          const playerCurrentlyOut = Object.values(highestTeam).filter(pl =>  pl.id.toString() === ids[1])[0] as IDisplayPlayer;
          changePlayers.currentlyIn = (newChange.currentlyIn.playerSide === Position.RIGHT) ? playerCurrentlyOut : playerCurrentlyIn;
          changePlayers.currentlyOut = (newChange.currentlyIn.playerSide === Position.RIGHT ) ? playerCurrentlyIn : playerCurrentlyOut;
        } else {
          const playerCurrentlyOut = playersToChange.filter(pl => pl.id.toString() === ids[1])[0] as IDisplayPlayer;
          changePlayers.currentlyIn = (newChange.currentlyIn.position > newChange.currentlyOut.position) ? playerCurrentlyIn : playerCurrentlyOut;
          changePlayers.currentlyOut = (newChange.currentlyIn.position > newChange.currentlyOut.position) ? playerCurrentlyOut : playerCurrentlyIn;
        } 
      }
      return changePlayers;
    }

    private pointsTypeMap: {[key: string]: {[vkey: string]: Function}} = {
      'event_points': {
        'setSelectPlayer': this.props.setSelectedPlayerCallback,
        'dragPlayerStart': this.dragPlayerStart,
        'dragPlayerOver': this.dragPlayerOver,
        'dragPlayerLeave': this.dragPlayerLeave,
        'addChange': this.addChange,
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
        'addChange': this.addChange,
        'dragCaptainStart': this.dragCaptainStart,
        'dragCaptainOver': this.dragCaptainOver,
        'dragCaptainLeave': this.dragCaptainLeave,
        'dragCaptainDrop': this.dragCaptainDrop,
      }
    }

    render() {
        const { pointsType, myTeam, highestTeam} = this.props;
        
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
            {maybeChipButton(this.state.tripleCaptainChip, 'Triple Captain', () => this.setState({useTripleCaptainChip: !this.state.useTripleCaptainChip}), this.state.useTripleCaptainChip, this.props.gameweekInfo)}
            {maybeChipButton(this.state.wildcardChip, 'Wildcard', () => this.setState({useWildcardChip: !this.state.useWildcardChip}), this.state.useWildcardChip, this.props.gameweekInfo)}
            {maybeChipButton(this.state.freehitChip, 'Free Hit', () => this.setState({useFreehitChip: !this.state.useFreehitChip}), this.state.useFreehitChip, this.props.gameweekInfo)}
            {maybeChipButton(this.state.benchboostChip, 'Bench Boost', () => this.setState({useBenchboostChip: !this.state.useBenchboostChip}), this.state.useBenchboostChip, this.props.gameweekInfo)}
          </div>
          <div className='team-config-buttons-wrapper'>
              <Button className='team-config-button' intent='primary' onClick={() => this.props.comparePlayersDrawerOpenCallback(myTeam, highestTeam)}> Compare Players </Button>
              {pointsType === 'cost' && (
              <>
                  <Button className='team-config-button' intent='success' disabled={this.checkOpenSubstitutes() && this.checkCaptainChange()} onClick={() => this.confirmTeamChangesToggle()}>
                  Confirm Team Changes </Button>
                  <Button className='team-config-button' intent='success' disabled={this.checkOpenTransfers()} onClick={() => this.confirmTransfersToggle()}>
                  Confirm Transfers </Button>
                  <Button className='team-config-button' intent='warning' disabled={this.checkOpenTransfers() && this.checkOpenSubstitutes() && this.checkCaptainChange()} onClick={() => this.resetChanges()}>
                  Reset</Button>
              </>)}
              {pointsType === 'cost' && <div className='chip-display'>
                {stat('Free Transfers ', [(this.state.openTransfers.length + getOrZero(this.state.transfersMetadata?.made)), getOrZero(this.state.transfersMetadata?.limit)])}
                {stat('In the Bank ', [getOrZero(this.state.transfersMetadata?.bank) / 10])}
                {stat('Cost of Team ', [getOrZero(this.state.transfersMetadata?.value) / 10])}
              </div>}
          </div>
          <div className='body-container'>
              <div className='pitches_container'>
              {[myTeam, highestTeam].map((team, index) => {
                  const teamSide: Position = index === 0 ? Position.LEFT : Position.RIGHT;
                  const points = pointsType === 'event_points' ? prop(team, 'actual_points') : prop(team, 'expected_points');
                  return (
                    typeof points === 'number' &&
                    <div>
                        <div className='team-layout'>
                        {DisplayTeam(
                            team,
                            teamSide,
                            this.pointsTypeMap[pointsType]['setSelectPlayer'],
                            this.pointsTypeMap[pointsType]['dragPlayerStart'],
                            this.pointsTypeMap[pointsType]['dragPlayerOver'],
                            this.pointsTypeMap[pointsType]['dragPlayerLeave'],
                            this.pointsTypeMap[pointsType]['addChange'],
                            this.pointsTypeMap[pointsType]['dragCaptainStart'],
                            this.pointsTypeMap[pointsType]['dragCaptainOver'],
                            this.pointsTypeMap[pointsType]['dragCaptainLeave'],
                            this.pointsTypeMap[pointsType]['dragCaptainDrop'],
                            pointsType)}
                        </div>
                        <div className='team-stats'>
                          {stat('Cost', [team.cost])}
                          {pointsType === 'event_points' ? stat('Points', [points, team.expected_points]) : stat('Points', [team.expected_points])}
                        </div>
                    </div>
                  )
                }
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
      getSelectedTeam,
    },
    dispatch,
  );
};

const mapStateToProps = (state: ICombinedReducers) => {
    return {
        selectedTeam: state.PlayerReducer.selectedTeam,
        playerListLatest: state.PlayerReducer.playerListLatest,
    };
  }
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompareTeams);