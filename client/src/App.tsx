import './App.scss';

import { Alignment, H1, Icon, IconName, Navbar, Tab, TabId, Tabs } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteComponentProps,
  Redirect,
  withRouter,
} from "react-router-dom";

import { getPlayerTypeList, getTeamList } from './actions/GlobalActions';
import { getPlayerLatestList, getPlayerList, getSelectedTeam } from './actions/PlayerActions';
import  MyTeam  from './components/MyTeam';
import Overview from './components/Overview';
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
  highestTeamThis: LoadState<IDisplayTeam>;
  highestTeamNext: LoadState<IDisplayTeam>;
  gameweekInfo: LoadState<IGameweekInfo>;
} 

interface RouterProps {}

export interface IAppProps extends RouteComponentProps<RouterProps> {
  getPlayerLatestList: typeof getPlayerLatestList,
  getPlayerTypeList: typeof getPlayerTypeList,
  getTeamList: typeof getTeamList,
  getPlayerList: typeof getPlayerList,
  getSelectedTeam: typeof getSelectedTeam,
 }

export class App extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)  
    this.state = {
      activePanelOnly: true,
      animate: true,
      navbarTabId: '',
      vertical: false,
      topIn: loading(),
      topOut: loading(),
      topSelected: loading(),
      pickedTeam: loading(),
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
    const resHighestTeamThis: Response = await fetch("http://localhost:8000/expectedPoints/highest/this");
    const resHighestTeamThisJson: IDisplayTeam = await resHighestTeamThis.json();
    const resHighestTeamNext: Response = await fetch("http://localhost:8000/expectedPoints/highest/next");
    const resHighestTeamNextJson: IDisplayTeam = await resHighestTeamNext.json();
    const gameweekInfo: Response = await fetch("http://localhost:8000/gameweek");
    const gameweekInfoJson: IGameweekInfo = await gameweekInfo.json();

    this.setState({
      topIn: loaded(resInJson),
      topOut: loaded(resOutJson),
      topSelected: loaded(resSelectedJson),
      pickedTeam: loaded(resPickedTeamJson),
      highestTeamThis: loaded(resHighestTeamThisJson),
      highestTeamNext: loaded(resHighestTeamNextJson),
      gameweekInfo: loaded(gameweekInfoJson),
    })
    
    const { getPlayerLatestList, getPlayerList, getPlayerTypeList, getTeamList, getSelectedTeam } = this.props;
    getPlayerLatestList("http://localhost:8000/players/latest/all");
    getPlayerList("http://localhost:8000/players/all");
    getPlayerTypeList("http://localhost:8000/players/types");
    getTeamList("http://localhost:8000/teams/all");
    getSelectedTeam("http://localhost:8000/expectedPoints/selected");
  }

  componentDidMount() {
      const navbarTabId = this.props.location.pathname.split('/').pop() as TabId
      this.setState({navbarTabId})
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

    const { navbarTabId } = this.state;

    if (navbarTabId === '') {
      return <div></div>;
    }

    const currentTab = navbarTabId ? this.tabTitles[navbarTabId]: '';

    const tabIdToComponentMap: IStringElementMap = {
      "overview": <Overview
        topIn={this.state.topIn}
        topOut={this.state.topOut}
        topSelected={this.state.topSelected}
        gameweekInfo={this.state.gameweekInfo}
      />,
      "playerAnalysis": <PlayerAnalysis />,
      "myTeam": <MyTeam
        pickedTeam={this.state.pickedTeam}
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
      <Router>
      <div className="bp3-dark">
        <Navbar className='app-nav-bar-wrapper'>
          <Navbar.Group>
              <Navbar.Heading className='app-header'>
                <div className='nav-bar'>
                  <div className='app-title'>Fantasy Premier League Analytics</div>
                  <div className={currentGameweek === '' ? 'bp3-skeleton' : 'render-intent-primary'}>{currentGameweek}</div>
                  <div className={currentGameweek === '' ? 'bp3-skeleton' : nextGameweekCountdownIntent}>{'Next Gameweek Deadline: ' + nextGameweekCountdown}</div>
                </div>
              </Navbar.Heading>
          </Navbar.Group> 
          <Navbar.Group align={Alignment.RIGHT}>
            <Tabs
              animate={this.state.animate}
              renderActiveTabPanelOnly={this.state.activePanelOnly}
              id="MainTabs"
              large={true}
              onChange={this.handleNavbarTabChange}
              selectedTabId={navbarTabId}
              vertical={false}>
                  {Object.entries(this.tabTitles).map((t) => {
                    const urlPath: string = t[0];
                    const tabTitle: string = t[1]['title'];
                    return <Tab
                      id={t[0]}
                      title={<Link to={`/home/${urlPath}`}>{tabTitle}</Link>}
                    />
                  })}
              <Tabs.Expander />
            </Tabs> 
          </Navbar.Group>
        </Navbar>
        <div className='main-container'>
            <div className='tab-title-wrapper'>
                {currentTab !== "" ? <div className={ !navbarTabId ? 'bp3-skeleton' : 'tab-title'}>
                    <Icon className={ !navbarTabId ? 'bp3-skeleton' : 'icon-title'} icon={currentTab['icon'] as IconName} iconSize={30} />
                    <H1 className={ !navbarTabId ? 'bp3-skeleton' : ''}>{currentTab['title']}</H1>
                  </div>: <div></div>}
            </div>
          <Switch>
            <Route
              path='/home'
              exact
              strict
              render={(): JSX.Element => <Redirect to="/home/overview/" />}
            />
          {Object.entries(this.tabTitles).map((t) => {
            return (
            <Route path={`/home/${t[0]}`}>
              {displayActiveTab(t[0])}
            </Route>
          )})}
          </Switch>
        </div>
      </div>
      </Router>
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
      getSelectedTeam,
    },
    dispatch,
  );
};

const mapStateToProps = (ownProps: IAppProps) => {
  return {
    ...ownProps
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
