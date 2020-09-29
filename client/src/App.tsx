import './App.scss';

import { Alignment, Navbar, Tab, TabId, Tabs } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPlayerTypeList, getTeamList } from './actions/GlobalActions';
import { getPlayerLatestList, getPlayerList } from './actions/PlayerActions';
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
      navbarTabId: "playerAnalysis",
      vertical: false,
    };
  }

  componentWillMount() {
    const { getPlayerLatestList, getPlayerList, getPlayerTypeList, getTeamList} = this.props;
    getPlayerLatestList("http://localhost:8000/players/latest/all");
    getPlayerList("http://localhost:8000/players/all");
    getPlayerTypeList("http://localhost:8000/players/types");
    getTeamList("http://localhost:8000/teams/all");
  }
 
  private tabIdToComponentMap: IStringElementMap = {
    "playerAnalysis": <PlayerAnalysis />,
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
      getPlayerLatestList,
      getPlayerTypeList,
      getPlayerList,
      getTeamList,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
