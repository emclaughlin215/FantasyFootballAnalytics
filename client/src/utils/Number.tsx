import { Divider } from "@blueprintjs/core";
import { round } from "lodash";
import React from "react";

export function getNumericDiff(prop_one: (number | undefined), prop_two: number | undefined): number {
  return round(getOrZero(prop_one) - getOrZero(prop_two), 2);
}

export function getOrZero(val: (number | undefined)): number {
  return val || 0;
}


export function stat(name: string, value: number[]) {
  return (
    <div className='stat-box'>
      <div className='stat-element'> {name}</div>
      <Divider className='stat-divider'/>
      <div className='stat-element'> {value.join(' / ')}</div>
    </div>
  )
}