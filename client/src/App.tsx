import './App.scss';

import { Alignment, H1, H3, Icon, IconName, Navbar, Tab, TabId, Tabs } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPlayerTypeList, getTeamList } from './actions/GlobalActions';
import { getPlayerLatestList, getPlayerList } from './actions/PlayerActions';
import  MyTeam  from './components/MyTeam';
import { Overview } from './components/Overview';
import PlayerAnalysis from './components/PlayerAnalysis';
import { IDisplayTeam, IGameweekInfo, IPlayer, IStringElementMap } from './index.d';
import { loaded, loading, LoadState } from './utils/LoadState';
import { getDateDiffUnix, formatDateDiffFromUnix, getCountdownIntent } from './utils/Date';

export interface IAppState {
  activePanelOnly: boolean;
  animate: boolean;
  navbarTabId: TabId;
  vertical: boolean;
  topIn: LoadState<IPlayer[]>;
  topOut: LoadState<IPlayer[]>;
  topSelected: LoadState<IPlayer[]>;
  pickedTeam: LoadState<IDisplayTeam>;
  selectedTeam: LoadState<IDisplayTeam>;
  highestTeamThis: LoadState<IDisplayTeam>;
  highestTeamNext: LoadState<IDisplayTeam>;
  gameweekInfo: LoadState<IGameweekInfo>;
}

export interface IAppProps {
  getPlayerLatestList: typeof getPlayerLatestList,
  getPlayerTypeList: typeof getPlayerTypeList,
  getTeamList: typeof getTeamList,
  getPlayerList: typeof getPlayerList,
 }

export class App extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props) 
    this.state = {
      activePanelOnly: true,
      animate: true,
      navbarTabId: "overview",
      vertical: false,
      topIn: loading(),
      topOut: loading(),
      topSelected: loading(),
      pickedTeam: loading(),
      selectedTeam: loading(),
      highestTeamThis: loading(),
      highestTeamNext: loading(),
      gameweekInfo: loading(),
    };
  }

  async componentWillMount() {
    fetch("http://localhost:8000/update/events", {method: 'PUT'});
    fetch("http://localhost:8000/update/PlayersAndTeams", {method: 'PUT'});
    const resIn: Response = await fetch("http://localhost:8000/transfers/topTenIn");
    const resInJson: IPlayer[] = await resIn.json();
    const resOut: Response = await fetch("http://localhost:8000/transfers/topTenOut");
    const resOutJson: IPlayer[] = await resOut.json();
    const resSelected: Response = await fetch("http://localhost:8000/players/topTenSelected");
    const resSelectedJson: IPlayer[] = await resSelected.json();
    const resPickedTeam: Response = await fetch("http://localhost:8000/expectedPoints/picked");
    const resPickedTeamJson: IDisplayTeam = await resPickedTeam.json();
    const resSelectedTeam: Response = await fetch("http://localhost:8000/expectedPoints/selected");
    const resSelectedTeamJson: IDisplayTeam = await resSelectedTeam.json();
    const resHighestTeamThis: Response = await fetch("http://localhost:8000/expectedPoints/highest_this");
    const resHighestTeamThisJson: IDisplayTeam = await resHighestTeamThis.json();
    const resHighestTeamNext: Response = await fetch("http://localhost:8000/expectedPoints/highest_next");
    const resHighestTeamNextJson: IDisplayTeam = await resHighestTeamNext.json();
    const gameweekInfo: Response = await fetch("http://localhost:8000/gameweek");
    const gameweekInfoJson: IGameweekInfo = await gameweekInfo.json();
    this.setState({
      topIn: loaded(resInJson),
      topOut: loaded(resOutJson),
      topSelected: loaded(resSelectedJson),
      pickedTeam: loaded(resPickedTeamJson),
      selectedTeam: loaded(resSelectedTeamJson),
      highestTeamThis: loaded(resHighestTeamThisJson),
      highestTeamNext: loaded(resHighestTeamNextJson),
      gameweekInfo: loaded(gameweekInfoJson),
    })
    
    const { getPlayerLatestList, getPlayerList, getPlayerTypeList, getTeamList} = this.props;
    getPlayerLatestList("http://localhost:8000/players/latest/all");
    getPlayerList("http://localhost:8000/players/all");
    getPlayerTypeList("http://localhost:8000/players/types");
    getTeamList("http://localhost:8000/teams/all");
  }

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  private tabTitles: {[tab: string]: {icon: string, title: string}} = {
    "overview": {
      "icon": "doughnut-chart",
      "title": "Overview",
    },
    "playerAnalysis": {
      "icon": "predictive-analysis",
      "title": "Player Analysis",
    },
    "myTeam": {
      "icon": "comparison",
      "title": "My Team",
    }
  }

  public render() {

    const currentTab = this.tabTitles[this.state.navbarTabId];

    const tabIdToComponentMap: IStringElementMap = {
      "overview": <Overview
        topIn={this.state.topIn}
        topOut={this.state.topOut}
        topSelected={this.state.topSelected}
      />,
      "playerAnalysis": <PlayerAnalysis />,
      "myTeam": <MyTeam
        pickedTeam={this.state.pickedTeam}
        selectedTeam={this.state.selectedTeam}
        highestTeamThis={this.state.highestTeamThis}
        highestTeamNext={this.state.highestTeamNext}
        gameweekInfo={this.state.gameweekInfo}
      />,
    }
    
    const displayActiveTab = (tabId: string) => tabIdToComponentMap[tabId];

    const getCurrentGameweek = () => {
      if (this.state.gameweekInfo.type !== 'loaded') {
        return '';
      }
      return this.state.gameweekInfo.value.current ? this.state.gameweekInfo.value.current.name : 'Inactive';
    }

    const currentGameweek = getCurrentGameweek()
    const deadline = this.state.gameweekInfo.type === 'loaded' ? new Date(this.state.gameweekInfo.value.next.deadline_time_epoch * 1000) : new Date();
    const distance = getDateDiffUnix(deadline);
    const nextGameweekCountdown = formatDateDiffFromUnix(distance);
    const nextGameweekCountdownIntent = getCountdownIntent(distance);

    return (
      <div className="bp3-dark">
        <Navbar>
          <Navbar.Group>
              <Navbar.Heading className='app-header'>
                <div>Fantasy Premier League Analytics</div>
              </Navbar.Heading>
          </Navbar.Group> 
          <Navbar.Group align={Alignment.RIGHT}>
            <Tabs
              animate={this.state.animate}
              renderActiveTabPanelOnly={this.state.activePanelOnly}
              id="MainTabs"
              large={true}
              onChange={this.handleNavbarTabChange}
              selectedTabId={this.state.navbarTabId}
              vertical={false}>
              {Object.entries(this.tabTitles).map((t) => {
                return <Tab id={t[0]} title={t[1]['title']} />
              })}
              <Tabs.Expander />
            </Tabs>
          </Navbar.Group>
        </Navbar>
        <div className='main-container'>
          <div className='gameweek'>
            <div className='render-intent-primary'>{currentGameweek}</div>
            <div className='tab-title'>
              <Icon className='icon-title' icon={currentTab['icon'] as IconName} iconSize={30} />
              <H1>{currentTab['title']}</H1>
            </div>
            <div className={nextGameweekCountdownIntent}>{'Next Gameweek Deadline: ' + nextGameweekCountdown}</div>
          </div>
          {displayActiveTab(this.state.navbarTabId.toString())}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getPlayerLatestList,
      getPlayerTypeList,
      getPlayerList,
      getTeamList,
    },
    dispatch,
  );
};

export default connect(null, mapDispatchToProps)(App);
