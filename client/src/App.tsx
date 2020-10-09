import './App.scss';

import { Alignment, Navbar, Tab, TabId, Tabs } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPlayerTypeList, getTeamList } from './actions/GlobalActions';
import { getPlayerLatestList, getPlayerList } from './actions/PlayerActions';
import { MyTeam } from './components/MyTeam';
import { Overview } from './components/Overview';
import PlayerAnalysis from './components/PlayerAnalysis';
import { IPickedTeam, IPlayer, IStringElementMap } from './index.d';
import { IGlobalReducer } from './reducers/GlobalReducers';
import { loaded, loading, LoadState } from './utils/LoadState';

export interface IAppState {
  activePanelOnly: boolean;
  animate: boolean;
  navbarTabId: TabId;
  vertical: boolean;
  topTenIn: LoadState<IPlayer[]>;
  topTenOut: LoadState<IPlayer[]>;
  topTenSelected: LoadState<IPlayer[]>;
  pickedTeam: LoadState<IPickedTeam[]>;
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
      topTenIn: loading(),
      topTenOut: loading(),
      topTenSelected: loading(),
      pickedTeam: loading(),
    };
  }

  async componentWillMount() {
    const resIn: Response = await fetch("http://localhost:8000/transfers/topTenIn");
    const resInJson: IPlayer[] = await resIn.json();
    const resOut: Response = await fetch("http://localhost:8000/transfers/topTenOut");
    const resOutJson: IPlayer[] = await resOut.json();
    const resSelected: Response = await fetch("http://localhost:8000/players/topTenSelected");
    const resSelectedJson: IPlayer[] = await resSelected.json();
    const resPickedTeam: Response = await fetch("http://localhost:8000/pickedTeam/");
    const resPickedTeamJson: IPickedTeam[] = await resPickedTeam.json();
    this.setState({})
    this.setState({
      topTenIn: loaded(resInJson),
      topTenOut: loaded(resOutJson),
      topTenSelected: loaded(resSelectedJson),
      pickedTeam: loaded(resPickedTeamJson),
    })
    
    const { getPlayerLatestList, getPlayerList, getPlayerTypeList, getTeamList} = this.props;
    getPlayerLatestList("http://localhost:8000/players/latest/all");
    getPlayerList("http://localhost:8000/players/all");
    getPlayerTypeList("http://localhost:8000/players/types");
    getTeamList("http://localhost:8000/teams/all");
  }

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  public render() {

    const tabIdToComponentMap: IStringElementMap = {
      "overview": <Overview
        topTenIn={this.state.topTenIn}
        topTenOut={this.state.topTenOut}
        topTenSelected={this.state.topTenSelected}
      />,
      "playerAnalysis": <PlayerAnalysis />,
      "myTeam": <MyTeam
        pickedTeam={this.state.pickedTeam}
      />,
    }
    
    const displayActiveTab = (tabId: string) => tabIdToComponentMap[tabId];
  
    return (
      <div className="bp3-dark">
        <Navbar>
          <Navbar.Group>
              <Navbar.Heading className='app-header'>
                  Fantasy Premier League Analytics
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
              <Tab id="overview" title="Overview" />
              <Tab id="playerAnalysis" title="Player Analysis" />
              <Tab id="myTeam" title="My Team" />
              <Tabs.Expander />
            </Tabs>
          </Navbar.Group>
        </Navbar>
        <div className='main-container'>
          {displayActiveTab(this.state.navbarTabId.toString())}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (globalState: IGlobalReducer) => {
  return {
    state: globalState,
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
