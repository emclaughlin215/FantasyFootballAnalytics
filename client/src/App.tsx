import './App.scss';

import { Alignment, Navbar, Tab, TabId, Tabs } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPlayerList, getPlayerTypeList, getTeamList } from './actions/GlobalActions';
import PerformanceAnalysis from './components/PerformanceAnalysis';
import PlayerAnalysis from './components/PlayerAnalysis';
import { IStringElementMap } from './index.d';
import { IGlobalReducer } from './reducers/GlobalReducers';

export interface IAppState {
  activePanelOnly: boolean;
  animate: boolean;
  navbarTabId: TabId;
  vertical: boolean;
}

export interface IAppProps {
  getPlayerList: typeof getPlayerList,
  getPlayerTypeList: typeof getPlayerTypeList,
  getTeamList: typeof getTeamList,
 }

export class App extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props) 
    this.state = {
      activePanelOnly: true,
      animate: true,
      navbarTabId: "playerAnalysis",
      vertical: false,
    };
  }

  componentWillMount() {
    const { getPlayerList, getPlayerTypeList, getTeamList} = this.props;
    getPlayerList("http://localhost:8000/players/all");
    getPlayerTypeList("http://localhost:8000/players/types");
    getTeamList("http://localhost:8000/teams/all");
  }
 
  private tabIdToComponentMap: IStringElementMap = {
    "playerAnalysis": <PlayerAnalysis />,
    "PerformanceAnalysis": <PerformanceAnalysis />
  }

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  private displayActiveTab = (tabId: string) => this.tabIdToComponentMap[tabId];

  public render() {
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
              <Tab id="playerAnalysis" title="Player Analysis"/>
              <Tab id="PerformanceAnalysis" title="Performance Analysis" />
              <Tabs.Expander />
            </Tabs>
          </Navbar.Group>
        </Navbar>
        <div className='main-container'>
          {this.displayActiveTab(this.state.navbarTabId.toString())}
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
      getPlayerList,
      getPlayerTypeList,
      getTeamList,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
