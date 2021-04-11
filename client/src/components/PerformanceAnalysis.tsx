import './PerformanceAnalysis.scss';

import { Table, TableLoadingOption, Utils } from '@blueprintjs/table';
import React from 'react';
import { connect } from 'react-redux';

import { IPlayer } from '../index.d';
import { IGlobalReducer } from '../reducers/GlobalReducers';
import { IPlayerReducer } from '../reducers/PlayerReducers';
import { ICombinedReducers } from '../reducers/Reducers';
import { ISortableColumn, NumberSortableColumn, StringSortableColumn } from '../utils/Tables';
import { prop } from '../utils/TypeScript';
import { NonIdealState } from '@blueprintjs/core';
import { round } from 'lodash';

export interface IPerformanceAnalysisProps { 
  globalState: IGlobalReducer,
  playerState: IPlayerReducer,
}
export interface IPerformanceAnalysisState { 
  sortedPlayerIndex: number[]
  columns: ISortableColumn<IPlayer>[]
 }

export class PerformanceAnalysis extends React.PureComponent<IPerformanceAnalysisProps, IPerformanceAnalysisState> {
  constructor(props: IPerformanceAnalysisProps) {
    super(props)
    this.state = { 
      sortedPlayerIndex: [],
      columns: [
        new StringSortableColumn('Name', "web_name"),
        new StringSortableColumn('First Name', "first_name"),
        new StringSortableColumn('Second Name', "second_name"),
        new NumberSortableColumn('Price', "cost"),
        new NumberSortableColumn('Points', "total_points"),
        new NumberSortableColumn('Form', "form"), 
        new NumberSortableColumn('Goals Scored', "goals_scored"),
        new NumberSortableColumn('Assists', "assists"),
        new NumberSortableColumn('Clean Sheets', "clean_sheets"),
        new NumberSortableColumn('Bonus System', "bps"),
        new NumberSortableColumn('Bonus Points', "bonus"),
        new NumberSortableColumn('Form / Cost', "form_to_cost"),
        new NumberSortableColumn('Bonus / Cost', "bonus_to_cost"),
      ] as ISortableColumn<IPlayer>[]
    }
  }

  getLoadingOptions = (): TableLoadingOption[] => {
    if (this.props.playerState.filteredPlayerLatest.type === "loading") {
      return [TableLoadingOption.CELLS];
    }
    return [];
  }

  sortColumn = (comparator: (a: any, b: any) => number) => {
    const { filteredPlayerLatest } = this.props.playerState;
    if (filteredPlayerLatest.type !== "loaded") {
      return;
    }
    let sortedIndex = Utils.times(filteredPlayerLatest.value.length, (i: number) => i);
    sortedIndex = sortedIndex.sort((a: number, b: number) => {
      return comparator(filteredPlayerLatest.value[a], filteredPlayerLatest.value[b]);
    });
    this.setState({ sortedPlayerIndex: sortedIndex });
  }

  private getCellData = (rowIndex: number, stat: keyof IPlayer) => {
    const { sortedPlayerIndex } = this.state;
    const { filteredPlayerLatest } = this.props.playerState;
    if (filteredPlayerLatest.type !== "loaded") {
      return undefined;
    }
    const sortedRowIndex = sortedPlayerIndex[rowIndex];
    if ((sortedRowIndex !== null) && (sortedRowIndex !== undefined)) {
        rowIndex = sortedRowIndex;
    }
    const propToDisplay = prop(filteredPlayerLatest.value[rowIndex], stat);

    if (typeof propToDisplay === 'number') {
      return round(propToDisplay, 2);
    } else {
      return propToDisplay;
    }
  };
  
  render() {
    const { filteredPlayerLatest } = this.props.playerState;
    const { columns } = this.state;
    const columnsList = filteredPlayerLatest.type === "loaded" ? columns.map(col => col.getColumn(this.getCellData, this.sortColumn)) : undefined;
    return (
      columnsList ? <div className='body-container'> 
        <div>
          <Table
            numRows={filteredPlayerLatest.type === "loading" ? 0 : filteredPlayerLatest.value.length > 30 ? 30 : filteredPlayerLatest.value.length}
            enableColumnReordering={true}
            numFrozenColumns={2}
            loadingOptions={this.getLoadingOptions()}>
            {columnsList}
          </Table>
        </div>
      </div> :
      <NonIdealState
        className="graph-non-ideal-state"
        title="No Filters Defined"
        description="Please filter the players to view Graphs"
      />
    )
  }
}

const mapStateToProps = (state: ICombinedReducers) => {
  return {
    globalState: state.GlobalReducer,
    playerState: state.PlayerReducer,
  };
}

export default connect(mapStateToProps)(PerformanceAnalysis)
