import './PerformanceAnalysis.scss';

import { H3, Icon, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { Table, TableLoadingOption, Utils } from '@blueprintjs/table';
import React from 'react';
import { connect } from 'react-redux';

import { IPlayer, IPlayerType, ITeam } from '../index.d';
import { IGlobalReducer } from '../reducers/GlobalReducers';
import { ICombinedReducers } from '../reducers/Reducers';
import { loaded, loading, LoadState } from '../utils/LoadState';
import {
  filterPlayerType,
  filterTeam,
  renderPlayerType,
  renderPlayerTypeInputValue,
  renderTeam,
  renderTeamInputValue,
} from '../utils/PlayerAnalysis';
import { ISortableColumn, NumberSortableColumn, StringSortableColumn } from '../utils/Tables';
import { prop } from '../utils/TypeScript';

export interface IPerformanceAnalysisProps { 
  state: IGlobalReducer
}
export interface IPerformanceAnalysisState { 
  filteredPlayerList: LoadState<IPlayer[]>
  sortedPlayerIndex: number[]
  selectedTeam?: ITeam
  selectedPlayerType?: IPlayerType
  columns: ISortableColumn<IPlayer>[]
 }

export class PerformanceAnalysis extends React.PureComponent<IPerformanceAnalysisProps, IPerformanceAnalysisState> {
  constructor(props: IPerformanceAnalysisProps) {
    super(props)
    this.state = { 
      filteredPlayerList: loading(),
      sortedPlayerIndex: [],
      columns: [
        new StringSortableColumn('Player',["first_name", "second_name"]),
        new NumberSortableColumn('Price', ["now_cost"]),
        new NumberSortableColumn('Points', ["total_points"]),
        new NumberSortableColumn('Form', ["form"]),
        new NumberSortableColumn('Goals Scored', ["goals_scored"]),
        new NumberSortableColumn('Assists', ["assists"]),
        new NumberSortableColumn('Clean Sheets', ["clean_sheets"]),
        new NumberSortableColumn('Bonus Points', ["bonus"]),
        new NumberSortableColumn('Form / Cost', ["form_to_cost"]),
        new NumberSortableColumn('Bonus / Cost', ["bonus_to_cost"]),
      ] as ISortableColumn<IPlayer>[]
    }
  }

  filterPlayersByTeam(team: ITeam) {
    this.filterPlayers(team, this.state.selectedPlayerType);
    this.setState({ selectedTeam: team });
  }

  filterPlayersByType(playerType: IPlayerType) {
    this.filterPlayers(this.state.selectedTeam, playerType);
    this.setState({ selectedPlayerType: playerType });
  }

  filterPlayers(team?: ITeam, playerType?: IPlayerType) {
    this.setState({ filteredPlayerList: loading() });
    const { playerList } = this.props.state;
    let filteredPlayers: IPlayer[] = playerList.type === 'loaded' ? playerList.value : [];
    filteredPlayers = playerType !== undefined
      ? filteredPlayers.filter((player: IPlayer) => player.element_type === playerType.id)
      : filteredPlayers;
    filteredPlayers = team !== undefined
      ? filteredPlayers.filter((player: IPlayer) => player.team === team.id)
      : filteredPlayers;
    this.setState({ filteredPlayerList: loaded(filteredPlayers) })
  }

  getLoadingOptions = (): TableLoadingOption[] => {
    if (this.props.state.playerList.type === "loading") {
      return [TableLoadingOption.CELLS];
    }
    return [];
  }

  sortColumn = (comparator: (a: any, b: any) => number) => {
    const players = this.state.filteredPlayerList;
    if (players.type !== "loaded") {
      return;
    }
    const sortedIndex = Utils.times(players.value.length, (i: number) => i);
    sortedIndex.sort((a: number, b: number) => {
      return comparator(players.value[a], players.value[b]);
    });
    this.setState({ sortedPlayerIndex: sortedIndex });
  }

  private getCellData = (rowIndex: number, stat: (keyof IPlayer)[]) => {
    const { filteredPlayerList, sortedPlayerIndex} = this.state;
    if (filteredPlayerList.type !== "loaded") {
      return undefined;
    }
    const sortedRowIndex = sortedPlayerIndex[rowIndex];
    if (sortedRowIndex != null) {
        rowIndex = sortedRowIndex;
    }
    return stat.map(s => { return prop(filteredPlayerList.value[rowIndex], s) })
        .reduce((a, b) => [a, b].join(" "));
  };
  
  render() {
    const { playerList, playerTypeList, teamList } = this.props.state;
    const { columns } = this.state;
    const PlayerTypeSuggest = Suggest.ofType<IPlayerType>();
    const TeamSuggest = Suggest.ofType<ITeam>();
    const columnsList = playerList.type === "loading"
      ? []
      : columns.map(col => col.getColumn(this.getCellData, this.sortColumn));
    return (
      <div className='body-container'> 
        <div className='tab-title'>
          <Icon icon={'predictive-analysis'} iconSize={20} />
          <H3 className='bp3-heading'>Performance Analysis</H3>
        </div> 
        <div>
          <div className='dropdown-container'>
            <PlayerTypeSuggest
              className={playerTypeList.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
              itemPredicate={filterPlayerType}
              inputValueRenderer={renderPlayerTypeInputValue}
              onItemSelect={(playerType: IPlayerType) => { this.filterPlayersByType(playerType) }}
              items={playerTypeList.type === 'loaded' ? playerTypeList.value : []}
              itemRenderer={renderPlayerType}
              noResults={<MenuItem disabled={true} text="No results." />}
            />
            <TeamSuggest
              className={teamList.type === 'loading' ? 'bp3-skeleton' : 'dropdown'}
              itemPredicate={filterTeam}
              inputValueRenderer={renderTeamInputValue}
              onItemSelect={(team: ITeam) => { this.filterPlayersByTeam(team) }}
              items={teamList.type === 'loaded' ? teamList.value : []}
              itemRenderer={renderTeam}
              noResults={<MenuItem disabled={true} text="No results." />}
            />
          </div>
          <div>
            <Table
              numRows={this.state.filteredPlayerList.type === "loading" ? 0 : this.state.filteredPlayerList.value.length > 20 ? 20 : this.state.filteredPlayerList.value.length}
              enableColumnReordering={true}
              numFrozenColumns={1}
              loadingOptions={this.getLoadingOptions()}>
              {columnsList}
            </Table>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: ICombinedReducers) => {
  return {
    state: state.GlobalReducer,
  };
}

export default connect(mapStateToProps)(PerformanceAnalysis)
