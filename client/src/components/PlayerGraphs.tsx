import { Checkbox, Colors, MenuItem, NonIdealState } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';
import { bindActionCreators } from 'redux';

import { addPropertiesToGraph } from '../actions/PlayerActions';
import { COLOURS } from '../constants';
import { IPlayer } from '../index.d';
import { ICombinedReducers } from '../reducers/Reducers';
import { AxisLabel } from '../utils/Graphs';
import { LoadState } from '../utils/LoadState';
import { capitaliseSentence } from '../utils/String';
import { filterProperty, renderProperty, renderPropertyInputValue } from '../utils/Suggest';
import { prop } from '../utils/TypeScript';

export interface PlayerGraphProps {
  playerListLatest: LoadState<IPlayer[]>,
  filteredPlayer: IPlayer[],
}

export interface PlayerGraphState {
  activeLine: string,
  activeLineColor: String;
  propertyToGraph?: keyof IPlayer,
}

export interface TemporalData {
  [key: string]: number | boolean | Date | string
}

export interface PlottingData {
  [key: string]: TemporalData
}

export interface GraphPoint {
  [key: string]: number | string | boolean | Date
}

export class PlayerGraphs extends React.PureComponent<PlayerGraphProps, PlayerGraphState> {
  constructor(props: PlayerGraphProps) {
    super(props);
    this.state = {
      activeLine: '',
      activeLineColor: COLOURS[0],
    }
  }

  private _drawLines(data: GraphPoint[]){
    let dataSet = data[0], lineArr = [];        
    let count = 0;
    for(let i in dataSet){
        if(dataSet.hasOwnProperty(i) && i !== 'timestamp' && count < 10){
          let color = COLOURS[count];
          lineArr.push(
            <Line
              type='monotone'
              strokeWidth={3}
              stroke={color}
              dataKey={i}
              key={`area-chart-${count}`}
              activeDot={{ r: 8, onMouseOver: this.setLineIndex, onMouseLeave: this.unsetLineIndex }}
            />)               
            count++;
        } 
    }
    return lineArr;
  }

  private setLineIndex = (e: any) => {
    this.setState({activeLine: e.dataKey});
  };

  private unsetLineIndex = (_obj: any, _idx: number) => {
    this.setState({activeLine: ''});
  };

  private addPropertyToGraph = (propertyToGraph: keyof IPlayer) => {
    this.setState({propertyToGraph})
  }

  render() {
    const { filteredPlayer, playerListLatest } = this.props;
    const { propertyToGraph } = this.state;

    const propertyBeingGraphed: keyof IPlayer = propertyToGraph ? propertyToGraph : 'total_points' as keyof IPlayer;  
  
    const PropertySuggest = Suggest.ofType<string>();
    const propertiesOfPlayer: string[] = playerListLatest.type === 'loaded' ?
      Object.keys(playerListLatest.value[0])
        .filter((k) => {
          return typeof prop(playerListLatest.value[0], k as keyof IPlayer) === 'number' ||
                 typeof prop(playerListLatest.value[0], k as keyof IPlayer) === 'bigint'
                }) :
        [];

    let plottingData: PlottingData = {}
    filteredPlayer.forEach((player) => {
      if (!(player['event'] in plottingData)) {
        plottingData[player['event']] = {};
      }
      plottingData[player['event']][player.second_name] = player[propertyBeingGraphed];
    })

    let data: GraphPoint[] = [];
    Object.entries(plottingData)
      .sort((a, b) => moment(a[0]).unix() - moment(b[0]).unix())
      .forEach((keyValue, index) => {
        let currentData: GraphPoint = {};
        currentData = keyValue[1];
        currentData["gameweek"] = "GW " + keyValue[0];
        data.push(currentData); 
      })

    const CustomTooltipOnYourLine = (e: TooltipProps) => {
      const { activeLine } = this.state;
      if (e.active && e.payload!=null && activeLine) {
        const activePayload = e.payload.filter((element => element.dataKey === activeLine))[0];
        return (
          <div className="custom-tooltip">
            <p style={{ color: this.state.activeLineColor.toString()}}>
              {activePayload.name + ': ' + activePayload.value + ' ' + capitaliseSentence(propertyBeingGraphed, '_')}
            </p>
          </div>);
        }
      else{
         return null;
      }
    }

    return (
      filteredPlayer !== [] ?  
      <div className='graph-container'>
        <div className='tab-dropdown-container'>
          <p className='dropdown'>Attribute</p>
          <PropertySuggest
            className={playerListLatest.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
            itemPredicate={filterProperty}
            inputValueRenderer={renderPropertyInputValue}
            onItemSelect={(property: string) => this.addPropertyToGraph(property as keyof IPlayer)}
            items={propertiesOfPlayer}
            itemRenderer={renderProperty}
            defaultSelectedItem={propertyBeingGraphed}
            noResults={<MenuItem disabled={true} text="No results." />}
          />
        </div>
        <ResponsiveContainer width={1600} height={600}>
          <LineChart
            width={1600}
            height={600}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="gameweek"
              tick={{ stroke: Colors.WHITE, strokeWidth: 0.5 }}
            />
            <YAxis
              tick={{ stroke: Colors.WHITE, strokeWidth: 0.5 }}
              tickLine={false}
              padding={{ top: 30, bottom: 30 }}
              />
            <CartesianGrid horizontal={false} vertical={false}/>
            <Tooltip
              labelStyle={{ color: Colors.LIGHT_GRAY3}}
              cursor={false}
              active={true}
              content={<CustomTooltipOnYourLine />}
              contentStyle={{backgroundColor: Colors.DARK_GRAY3, height: '40vh', overflow: 'scroll'}}
            />
            <Legend />
            {this._drawLines(data)}
          </LineChart>
        </ResponsiveContainer>
      </div> :
      <NonIdealState
        className="graph-non-ideal-state"
        title="No Filters Defined"
        description="Please filter the players to view Graphs"
      />
    )
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      addPropertiesToGraph,
    },
    dispatch,
  );
};

const mapStateToProps = (state: ICombinedReducers) => {
  return {
    playerState: state.PlayerReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerGraphs);
