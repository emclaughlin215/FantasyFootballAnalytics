import { Menu, MenuItem } from '@blueprintjs/core';
import { Cell, Column, ColumnHeaderCell } from '@blueprintjs/table';
import React from 'react';

import { IPlayer } from './../index.d';
import { prop } from './TypeScript';

export type ICellLookup = (rowIndex: number, stat: (keyof IPlayer)[]) => any;
export type ISortCallback = (comparator: (a: IPlayer, b: IPlayer) => number) => void;

export interface ISortableColumn<T> {
    getColumn(getCellData: ICellLookup, sortColumn: ISortCallback): JSX.Element;
}

abstract class AbstractSortableColumn implements ISortableColumn<IPlayer> {
  constructor(protected name: string, protected stat: (keyof IPlayer)[]) {}

  public getColumn(getCellData: ICellLookup, sortColumn: ISortCallback) {
    const cellRenderer = (rowIndex: number) => (
        <Cell>{getCellData(rowIndex, this.stat)}</Cell>
      );
      const columnHeaderCellRenderer = () => <ColumnHeaderCell name={this.name} menuRenderer={() => this.renderMenu(sortColumn)} />;
      return (
          <Column
              cellRenderer={cellRenderer}
              columnHeaderCellRenderer={columnHeaderCellRenderer}
              name={this.name}
          />
      );
  }

  protected abstract renderMenu(sortColumn: ISortCallback): JSX.Element;
}

export class StringSortableColumn extends AbstractSortableColumn {
  protected renderMenu(sortColumn: ISortCallback) {
      const sortAsc = () => sortColumn((a, b) => this.compare(a, b));
      const sortDesc = () => sortColumn((a, b) => this.compare(b, a));
      return ( 
          <Menu>
              <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc" />
              <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc" />
          </Menu>
      );
  }

  private compare(a: IPlayer, b: IPlayer) {
    if (typeof this.stat[0] !== 'string') {
      return 0;
    }
    return prop(a, this.stat[0]).toString().localeCompare(prop(b, this.stat[0]).toString());
  }
}

export class NumberSortableColumn extends AbstractSortableColumn {
    protected renderMenu(sortColumn: ISortCallback) {
        const sortAsc = () => sortColumn((a, b) => this.compare(a, b));
        const sortDesc = () => sortColumn((a, b) => this.compare(b, a));
        return (
            <Menu>
                <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc" />
                <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc" />
            </Menu>
        ); 
    }

  private compare(a: IPlayer, b: IPlayer) {
    if ((typeof this.stat[0] !== 'number') || (typeof this.stat[0] !== 'bigint')) {
      return 0;
    }
      return prop(a, this.stat[0]) - prop(b, this.stat[0]);
    }
}