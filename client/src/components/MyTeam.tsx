import './MyTeam.scss';

import React from 'react';
import { connect } from 'react-redux';

import { IChange, IDisplayPlayer, IDisplayTeam, IGameweekInfo, IPlayer, IStringElementMap } from '../index.d';
import { getPropertyIfLoadedOrElse, loaded, loading, LoadState } from '../utils/LoadState';
import { Drawer, MenuItem, NonIdealState, Position, Tab, TabId, Tabs } from '@blueprintjs/core';
import PlayerDetails from './PlayerDetails';
import { ICombinedReducers } from '../reducers/Reducers';
import { IPlayerReducer } from '../reducers/PlayerReducers';
import { SuggestedChanges } from './SuggestedChanges';
import CompareTeams from './CompareTeams';
import { Suggest } from '@blueprintjs/select';
import { filterPlayer, renderPlayerInputValue, renderPlayer } from '../utils/Suggest';
import PlayerGraphs from './PlayerGraphs';


export interface MyTeamState {
  navbarTabId: TabId;
  playerDetailsDrawerSide: Position;
  comparePlayersDrawerIsOpen: boolean;
  selectedPlayerDetails?: IPlayer;
  suggestedTransfers: LoadState<IChange[]>;
  comparePlayerSelectedLeft?: IDisplayPlayer;
  comparePlayerSelectedRight?: IDisplayPlayer;
}

export interface MyTeamOwnProps {
  pickedTeam: LoadState<IDisplayTeam>
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
      navbarTabId: 'next',
      playerDetailsDrawerSide: Position.RIGHT,
      comparePlayersDrawerIsOpen: false,
      suggestedTransfers: loading(),
    }
  }

  async componentDidMount() {
    const transfers: Response = await fetch('http://localhost:8000/transfers/suggested/');
    const transfersJson: IChange[] = await transfers.json();

    this.setState({
      suggestedTransfers: loaded(transfersJson),
    })
  }

  private comparePlayersDrawerOpen = (leftTeam?: LoadState<IDisplayTeam>, rightTeam?: LoadState<IDisplayTeam>, playerAId?: number, playerBId?: number): void => {
    const { playerState } = this.props;

    const playerA: IDisplayPlayer | undefined = (playerAId && playerState.playerListLatest.type === 'loaded')
      ? playerState.playerListLatest.value.filter(player => player.id === playerAId)[0]
      : (leftTeam && leftTeam.type === 'loaded') ? leftTeam.value.team[0] : undefined;

    const playerB: IDisplayPlayer | undefined = (playerBId && playerState.playerListLatest.type === 'loaded')
      ? playerState.playerListLatest.value.filter(player => player.id === playerBId)[0]
      : (rightTeam && rightTeam.type === 'loaded') ? rightTeam.value.team[0] : undefined;

    this.setState({ comparePlayerSelectedLeft: playerA, comparePlayerSelectedRight: playerB, comparePlayersDrawerIsOpen: true})
  }

  private setSelectedPlayer = (player: IPlayer, team_side: Position): void => {
    this.setState({selectedPlayerDetails: player, playerDetailsDrawerSide: team_side})
  }

  private handleSelectPlayer = (selectedPlayer: IDisplayPlayer, side: Position) => {
    if (side === Position.LEFT) {
      this.setState({comparePlayerSelectedLeft: selectedPlayer})
    } else {
      this.setState({comparePlayerSelectedRight: selectedPlayer})
    }
  }

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() {
    const { playerState, pickedTeam, highestTeamThis, highestTeamNext, gameweekInfo} = this.props;
    const { selectedPlayerDetails, playerDetailsDrawerSide, suggestedTransfers, comparePlayerSelectedLeft, comparePlayerSelectedRight } = this.state;
    const { playerListLatest, selectedTeam } = this.props.playerState;

    const PlayerSuggest = Suggest.ofType<IDisplayPlayer>();

    const playersToCompared: LoadState<IPlayer[][]> = loaded([]);
    [comparePlayerSelectedLeft, comparePlayerSelectedRight].map(player => {
        if (player !== undefined && playerListLatest.type === 'loaded') {
            const playerToCompare: IPlayer[] = playerListLatest.value.filter(pl => pl.id === player.id);
            playersToCompared.value.push(playerToCompare)
        }
    })
    const playersBeingCompared: LoadState<IPlayer[]> = loaded(playersToCompared.value.flat(2))

    const playerSelected: IPlayer | undefined | false = playerState.playerListLatest.type === 'loaded' && selectedPlayerDetails && 
      playerState.playerListLatest.value.filter((player) => player.id === selectedPlayerDetails.id)[0];

    const tabIdToComponentMap: IStringElementMap = {
      "current": <CompareTeams
        myTeam={pickedTeam}
        highestTeam={highestTeamThis}
        pointsType={"event_points"}
        comparePlayersDrawerIsOpen={this.state.comparePlayersDrawerIsOpen}
        comparePlayerSelectedLeft={this.state.comparePlayerSelectedLeft}
        comparePlayerSelectedRight={this.state.comparePlayerSelectedRight}
        gameweekInfo={gameweekInfo}
        comparePlayersDrawerOpenCallback={this.comparePlayersDrawerOpen}
        setSelectedPlayerCallback={this.setSelectedPlayer}
      />,
      "next": <CompareTeams
        myTeam={selectedTeam}
        highestTeam={highestTeamNext}
        pointsType={'cost'}
        gameweekInfo={gameweekInfo}
        comparePlayersDrawerIsOpen={this.state.comparePlayersDrawerIsOpen}
        comparePlayerSelectedLeft={this.state.comparePlayerSelectedLeft}
        comparePlayerSelectedRight={this.state.comparePlayerSelectedRight}
        comparePlayersDrawerOpenCallback={this.comparePlayersDrawerOpen}
        setSelectedPlayerCallback={this.setSelectedPlayer}
      />,
    }

    return (
      <div className='player-analysis-tabs'>
        <Drawer
          className="selected-player-drawer"
          title={'Player Information: ' + (playerSelected ? (playerSelected.web_name) : '')}
          isOpen={selectedPlayerDetails !== undefined}
          onClose={() => this.setState({selectedPlayerDetails: undefined})}
          canOutsideClickClose={true}
          isCloseButtonShown={true} 
          position={playerDetailsDrawerSide}
          size={Drawer.SIZE_LARGE}>
            <PlayerDetails player={selectedPlayerDetails} gameweek={this.props.gameweekInfo}/>
        </Drawer>
        <Drawer
          className="selected-player-drawer"
          title={'Player Comparison'}
          isOpen={this.state.comparePlayersDrawerIsOpen}
          onClose={() => this.setState({ comparePlayersDrawerIsOpen: false })} 
          canOutsideClickClose={true}
          isCloseButtonShown={true}
          position={Position.BOTTOM}
          size={Drawer.SIZE_LARGE}>
          <div className='compare-player-container'>
            <div className='compare-player-details-container'>
            <div className='compare-player-left compare-player-select'>
              <PlayerSuggest
              className={'bp3-dark ' + (selectedTeam.type === 'loading' ? 'bp3-skeleton' : 'dropdown')}
              defaultSelectedItem={this.state.comparePlayerSelectedLeft}
              itemPredicate={filterPlayer}
              inputValueRenderer={renderPlayerInputValue}
              onItemSelect={(player: IDisplayPlayer) => this.handleSelectPlayer(player, Position.LEFT)}
              items={Object.entries(getPropertyIfLoadedOrElse(selectedTeam, 'team', {})).map(pl => pl[1]).sort((a, b) => a.element_type - b.element_type)}
              itemRenderer={renderPlayer}
              noResults={<MenuItem disabled={true} text="No results." />}
              />
            </div> 
            <div className='compare-player-left compare-player-details'>
              <PlayerDetails player={this.state.comparePlayerSelectedLeft} gameweek={this.props.gameweekInfo}/>
            </div>
            <div className='compare-player-right compare-player-select'>
              <PlayerSuggest
              className={'bp3-dark ' + (selectedTeam.type === 'loading' ? 'bp3-skeleton' : 'dropdown')}
              defaultSelectedItem={this.state.comparePlayerSelectedRight}
              itemPredicate={filterPlayer}
              inputValueRenderer={renderPlayerInputValue}
              onItemSelect={(player: IDisplayPlayer) => this.handleSelectPlayer(player, Position.RIGHT)}
              items={Object.entries(getPropertyIfLoadedOrElse(highestTeamNext, 'team', {})).map(pl => pl[1]).sort((a, b) => a.element_type - b.element_type)}
              itemRenderer={renderPlayer}
              noResults={<MenuItem disabled={true} text="No results." />}
              />
            </div>
            <div className='compare-player-right compare-player-details'>
                <PlayerDetails player={this.state.comparePlayerSelectedRight} gameweek={this.props.gameweekInfo}/>
            </div>
            </div>
            <PlayerGraphs playerListLatest={playerListLatest} filteredPlayer={playersBeingCompared}/> 
          </div>
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
          {pickedTeam.type === 'loaded' ? tabIdToComponentMap[this.state.navbarTabId.toString()] : <NonIdealState className="graph-non-ideal-state" title="Loading Teams..." description="Getting your teams!" />}
        </div>
        <SuggestedChanges comparePlayersDrawerOpen={this.comparePlayersDrawerOpen} suggestedChanges={suggestedTransfers}/>
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