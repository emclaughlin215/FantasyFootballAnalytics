import './Overview.scss';

import { Button, ButtonGroup, Colors, H3, Icon, Tab, TabId, Tabs } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { Bar, BarChart, CartesianGrid, LabelList, Legend, XAxis, YAxis, Tooltip } from 'recharts';

import { IPlayer, IStringElementMap } from '../index.d';
import { getIfLoadedOrElse, LoadState } from '../utils/LoadState';
import { capitaliseSentence, numberAbbreviator } from '../utils/String';

export interface OverviewProps {
  topIn: LoadState<IPlayer[]>;
  topOut: LoadState<IPlayer[]>;
  topSelected: LoadState<IPlayer[]>;
}

export interface OverviewState {
  navbarTabId: TabId; 
  numberTopIn: number;
  numberTopOut: number; 
  numberTopSelected: number;
  startTopIn: number;
  startTopOut: number; 
  startTopSelected: number;
}

export class Overview extends React.PureComponent<OverviewProps, OverviewState> {
  constructor(props: OverviewProps) {
    super(props);
    this.state = {
      navbarTabId: "topIn",
      numberTopIn: 10,
      numberTopOut: 10,
      numberTopSelected: 10,
      startTopIn: 0,
      startTopOut: 0,
      startTopSelected: 0,
    }
  }

  private TopPlayers(players: LoadState<IPlayer[]>, topNumber: number, topStart: number, property: keyof IPlayer, units: string) {
    const name: string = capitaliseSentence(property.toString(), '_');
    const playersData: IPlayer[] = getIfLoadedOrElse(players, []).slice(topStart, topStart + topNumber);
    
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
    const { numberTopIn, numberTopOut, numberTopSelected, startTopIn, startTopOut, startTopSelected, navbarTabId } = this.state;

    const changeTopNumber = (alter: number) => {
      if (navbarTabId === 'topIn') {
        const changeBy: number = Math.max(5, numberTopIn + alter * 5)
        this.setState({ numberTopIn: changeBy}) 
      } else if (navbarTabId === 'topOut') {
        const changeBy: number = Math.max(5, numberTopOut + alter * 5)
        this.setState({ numberTopOut: changeBy}) 
      } else if (navbarTabId === 'topSelected') {
        const changeBy: number = Math.max(5, numberTopSelected + alter * 5)
        this.setState({ numberTopSelected: changeBy})
      }
    }

    const checkNumberDisabled = () => {
      if (navbarTabId === 'topIn') {
        return numberTopIn <= 5;
      } else if (navbarTabId === 'topOut') {
        return numberTopOut <= 5;
      } else if (navbarTabId === 'topSelected') {
        return numberTopSelected <= 5;
      }
    }

    const shiftTopNumber = (alter: number) => {
      if (navbarTabId === 'topIn') {
        const changeBy: number = Math.max(0, startTopIn + alter * 5)
        this.setState({ startTopIn: changeBy}) 
      } else if (navbarTabId === 'topOut') {
        const changeBy: number = Math.max(0, startTopOut + alter * 5)
        this.setState({ startTopOut: changeBy}) 
      } else if (navbarTabId === 'topSelected') {
        const changeBy: number = Math.max(0, startTopSelected + alter * 5)
        this.setState({ startTopSelected: changeBy})
      }
    }

    const checkShiftDisabled = () => {
      if (navbarTabId === 'topIn') {
        return startTopIn <= 0;
      } else if (navbarTabId === 'topOut') {
        return numberTopOut <= 0;
      } else if (navbarTabId === 'topSelected') {
        return numberTopSelected <= 0;
      }
    }

    const tabIdToComponentMap: IStringElementMap = {
      "topIn": this.TopPlayers(this.props.topIn, this.state.numberTopIn, this.state.startTopIn, 'transfers_in_event' as keyof IPlayer, ''),
      "topOut": this.TopPlayers(this.props.topOut, this.state.numberTopOut, this.state.startTopOut, 'transfers_out_event' as keyof IPlayer, ''),
      "topSelected": this.TopPlayers(this.props.topSelected, this.state.numberTopSelected, this.state.startTopSelected, 'selected_by_percent' as keyof IPlayer, '%'),
    }
    return (
      <div>
        <div className='overview-tabs'> 
          <Tabs
            animate={true}
            renderActiveTabPanelOnly={true}
            id="MainTabs"
            large={true}
            onChange={this.handleNavbarTabChange}
            selectedTabId={this.state.navbarTabId}
            vertical={true}>
            <Tab id="topIn" title="Transfers In" />
            <Tab id="topOut" title="Transfers Out" />
            <Tab id="topSelected" title="Selected By" />
            <Tabs.Expander />
          </Tabs>
          <div className='graph-container'>
            <ButtonGroup minimal={false}>
              <Button disabled={checkShiftDisabled()} onClick={() => shiftTopNumber(-1)} icon="caret-left"></Button>
              <Button disabled={checkNumberDisabled()} onClick={() => changeTopNumber(-1)}>-</Button>
              <Button onClick={() => changeTopNumber(1)}>+</Button>
              <Button onClick={() => shiftTopNumber(1)} icon="caret-right"></Button>
            </ButtonGroup>
            {tabIdToComponentMap[this.state.navbarTabId.toString()]}
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Overview);
