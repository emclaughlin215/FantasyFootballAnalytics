import './Overview.scss';

import { Colors, H3, Icon, Tab, TabId, Tabs } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { Bar, BarChart, CartesianGrid, LabelList, Legend, XAxis, YAxis, Tooltip } from 'recharts';

import { IPlayer, IStringElementMap } from '../index.d';
import { LoadState } from '../utils/LoadState';
import { capitaliseSentence, numberAbbreviator } from '../utils/String';

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

  private TopTens(players: LoadState<IPlayer[]>, property: keyof IPlayer, units: string) {
    const name: string = capitaliseSentence(property.toString(), '_');
    const playersData: IPlayer[] = players.type === 'loaded' ? players.value : [];
    
    return (
        <BarChart className={players.type === 'loading' ? 'bp3-skeleton' : ''}  width={1600} height={600} data={playersData}>
          <XAxis
            dataKey="second_name"
            tick={{ stroke: Colors.WHITE, strokeWidth: 0.5, fontSize: '12px', width: '50px', wordWrap: 'break-word' }}
            interval={0}
          />
          <YAxis
            tick={{ stroke: Colors.WHITE, strokeWidth: 0.5 }}
            tickFormatter={numberAbbreviator}
            unit={units}
          />
          <Tooltip
            contentStyle={{backgroundColor: Colors.DARK_GRAY3}}
            cursor={false}
            itemStyle={{ fontWeight: 'Bold' }}
            />
          <Legend />
          <CartesianGrid horizontal={false} vertical={false}/>
        <Bar name={name} dataKey={property} fill="#8884d8">
          <LabelList
            position="center"
            valueAccessor={(player: IPlayer) => { return player[property]}} />
        </Bar>
        </BarChart>
    )
  } 

  private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() {
    const tabIdToComponentMap: IStringElementMap = {
      "topTenIn": this.TopTens(this.props.topTenIn, 'transfers_in_event' as keyof IPlayer, ''),
      "topTenOut": this.TopTens(this.props.topTenOut, 'transfers_out_event' as keyof IPlayer, ''),
      "topTenSelected": this.TopTens(this.props.topTenSelected, 'selected_by_percent' as keyof IPlayer, '%'),
    }
    return (
      <div>
        <div className='tab-title'>
          <Icon className='icon-title' icon={'doughnut-chart'} iconSize={20} />
          <H3 className='bp3-heading'>Overview</H3>
        </div>
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
          <div className='graph-container'>
            {tabIdToComponentMap[this.state.navbarTabId.toString()]}
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Overview);
