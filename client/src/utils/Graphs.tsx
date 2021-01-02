import React from "react";

type AxisType = 'yAxis' | 'xAxis';

interface AxisLabelProps {
  axisType: AxisType,
  children: any,
}

export const AxisLabel = (axisProps: AxisLabelProps) => {
    const { axisType, children } = axisProps;
    const isVert =  axisType === 'yAxis';
    const rot = isVert ? `270` : 0;
    return (
      <text transform={`rotate(${rot})`} textAnchor="middle">
        {children}
      </text>
    );
  };