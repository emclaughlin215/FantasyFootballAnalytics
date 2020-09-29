import { Colors, MenuItem, Tooltip } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import { bindActionCreators } from 'redux';

import { addPropertiesToGraph } from '../actions/PlayerActions';
import { COLOURS } from '../constants';
import { IPlayer } from '../index.d';
import { IPlayerReducer } from '../reducers/PlayerReducers';
import { ICombinedReducers } from '../reducers/Reducers';
import { filterProperty, renderProperty, renderPropertyInputValue } from '../utils/Suggest';
import { prop } from '../utils/TypeScript';

export interface PlayerGraphProps {
  playerState: IPlayerReducer
  addPropertiesToGraph: typeof addPropertiesToGraph;
}

export  interface PlayerGraphState {
  player: IPlayer
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
  }

  private _drawLines(data: GraphPoint[]){
    let dataSet = data[0], lineArr = [];        
    let count = 0;
    for(let i in dataSet){
        if(dataSet.hasOwnProperty(i) && i !== 'timestamp'){
          lineArr.push(<Line type='monotone' strokeWidth={3} stroke={COLOURS[count]} dataKey={i} key={`area-chart-${count}`}/>)               
            count++;
        } 
    }
    return lineArr;
}

  render() {
    const { filteredPlayer, propertyToGraph, playerListLatest } = this.props.playerState;
    const filterPlayerValue: IPlayer[] = filteredPlayer.type === 'loaded' ? filteredPlayer.value : []
    const propertyBeingGraphed: keyof IPlayer = propertyToGraph ? propertyToGraph : '' as keyof IPlayer;
    
    const PropertySuggest = Suggest.ofType<string>();
    const propertiesOfPlayer: string[] = playerListLatest.type === 'loaded'
      ? Object.keys(playerListLatest.value[0])
        .filter((k) => {
          return typeof prop(playerListLatest.value[0], k as keyof IPlayer) === 'number' ||
                 typeof prop(playerListLatest.value[0], k as keyof IPlayer) === 'bigint'
        })
      : [];
    const plottingData: PlottingData = {}
    filterPlayerValue.forEach((player) => {
      if (player.timestamp.toString() in plottingData) {
        plottingData[player.timestamp.toString()][player.second_name] = player[propertyBeingGraphed];
      } else {
        plottingData[player.timestamp.toString()] = {};
        plottingData[player.timestamp.toString()][player.second_name] = player[propertyBeingGraphed];
      }
    })
    const data: GraphPoint[] = [];
    Object.entries(plottingData)
      .sort((a, b) => moment(a[0]).unix() - moment(b[0]).unix())
      .forEach((keyValue, index) => {
        if (index === 0) {
        } else {
          let currentData: GraphPoint = {};
          currentData = keyValue[1];
          currentData["timestamp"] = "GW" + (index).toString() + " " + moment(keyValue[0]).format("DD MMM YY");
          data.push(currentData);
        }
      })
    return (
      <div>
        <div className='dropdown-container'>
          <p className='dropdown'>Attribute</p>
          <PropertySuggest
            className={playerListLatest.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
            itemPredicate={filterProperty}
            inputValueRenderer={renderPropertyInputValue}
            onItemSelect={(property: string) => this.props.addPropertiesToGraph(property as keyof IPlayer)}
            items={propertiesOfPlayer}
            itemRenderer={renderProperty}
            defaultSelectedItem={'total_points'}
            noResults={<MenuItem disabled={true} text="No results." />}
          />
        </div>
        <LineChart width={1100} height={500} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />s
          <XAxis
            dataKey="timestamp"
            tick={{ stroke: Colors.WHITE, strokeWidth: 0.5 }}
            padding={{ left: 30, right: 30 }} />
          <YAxis
            tick={{ stroke: Colors.WHITE, strokeWidth: 0.5 }}
            tickLine={false}
            padding={{ top: 30, bottom: 30 }} />
          <Tooltip />
          <Legend />
          {this._drawLines(data)}
        </LineChart>
      </div>
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
