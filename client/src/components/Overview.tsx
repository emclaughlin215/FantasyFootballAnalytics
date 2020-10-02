import { Colors, Tab, TabId, Tabs, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

import { IPlayer, IStringElementMap } from '../index.d';
import { LoadState } from '../utils/LoadState';

export interface OverviewProps {
  topTenIn: LoadState<IPlayer[]>;
  topTenOut: LoadState<IPlayer[]>;
  topTenSelected: LoadState<IPlayer[]>;
}

export interface OverviewState {
  navbarTabId: TabId; 
}

export class Overview extends React.PureComponent<OverviewProps, OverviewState> {
  constructor(props: OverviewProps) {
    super(props);
    this.state = {
      navbarTabId: "topTenIn"
    }
  }

  private TopTens(players: LoadState<IPlayer[]>, property: keyof IPlayer) {
    return (
      players.type === 'loaded' ? <BarChart width={730} height={250} data={players.value}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="first_name"
          tick={{ stroke: Colors.WHITE, strokeWidth: 0.5 }}
        />
        <YAxis
          tick={{ stroke: Colors.WHITE, strokeWidth: 0.5 }}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey={property} fill="#8884d8" />
      </BarChart> : <div></div>
    )
  } 

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() {
    const tabIdToComponentMap: IStringElementMap = {
      "topTenIn": this.TopTens(this.props.topTenIn, 'transfers_in_event' as keyof IPlayer),
      "topTenOut": this.TopTens(this.props.topTenOut, 'transfers_out_event' as keyof IPlayer),
      "topTenSelected": this.TopTens(this.props.topTenSelected, 'selected_by_percent' as keyof IPlayer),
    }
    return (
      <div className='overview-tabs'> 
        <Tabs
          animate={true}
          renderActiveTabPanelOnly={true}
          id="MainTabs"
          large={true}
          onChange={this.handleNavbarTabChange}
          selectedTabId={this.state.navbarTabId}
          vertical={true}>
          <Tab id="topTenIn" title="Transfers In" />
          <Tab id="topTenOut" title="Transfers Out" />
          <Tab id="topTenSelected" title="Selected By" />
          <Tabs.Expander />
        </Tabs>
        <div>
          {tabIdToComponentMap[this.state.navbarTabId.toString()]}
        </div>
      </div>
    )
  }
}

export default connect()(Overview);
