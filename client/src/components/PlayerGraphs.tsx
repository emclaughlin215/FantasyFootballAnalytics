import { Colors, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

import { IPlayer } from '../index.d';
import { IPlayerReducer } from '../reducers/PlayerReducers';
import { ICombinedReducers } from '../reducers/Reducers';

export interface PlayerGraphProps {
  playerState: IPlayerReducer
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
    const colours = [Colors.RED3, Colors.ROSE3, Colors.BLUE3, Colors.COBALT3, Colors.TURQUOISE3, Colors.GREEN3, Colors.LIME3,
      Colors.FOREST3, Colors.GOLD3, Colors.INDIGO3, Colors.LIGHT_GRAY3, Colors.VERMILION3, Colors.SEPIA3, Colors.INDIGO3,
      Colors.ORANGE3, Colors.VIOLET3, Colors.RED1, Colors.ROSE1, Colors.BLUE1, Colors.COBALT1, Colors.TURQUOISE1, Colors.GREEN1,
      Colors.LIME1, Colors.FOREST1, Colors.GOLD1, Colors.INDIGO1, Colors.DARK_GRAY3, Colors.VERMILION1, Colors.SEPIA1,
      Colors.INDIGO1];
    for(let i in dataSet){
        if(dataSet.hasOwnProperty(i) && i !== 'timestamp'){
          lineArr.push(<Line type='monotone' stroke={colours[count]} dataKey={i} key={`area-chart-${count}`}/>)               
            count++;
        } 
    }
    return lineArr;
}

  render() {
    const { filteredPlayer, propertyToGraph } = this.props.playerState;
    const filterPlayerValue: IPlayer[] = filteredPlayer.type === 'loaded' ? filteredPlayer.value : []
    const propertyBeingGraphed: keyof IPlayer = propertyToGraph ? propertyToGraph : '' as keyof IPlayer;
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
    Object.entries(plottingData).forEach((keyValue) => {
      let currentData: GraphPoint = {};
      currentData = keyValue[1];
      currentData["timestamp"] = keyValue[0];
      data.push(currentData);
    })
    return (
      <div>
        <LineChart width={1100} height={500} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />s
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {this._drawLines(data)}
        </LineChart>
      </div>
    )
  }
}

const mapStateToProps = (state: ICombinedReducers) => {
  return {
    playerState: state.PlayerReducer,
  };
}

export default connect(mapStateToProps)(PlayerGraphs);
