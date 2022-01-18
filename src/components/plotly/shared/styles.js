import { createElement, forwardRef } from 'react'
import { setup, styled } from 'goober'


setup(createElement)

const MIN_SIZE = 60
const MAX_SIZE = 100

const Wrapper = styled('div', forwardRef)`
  height: 100%;
  width: 100%;
`

const SubPlotGrid = styled('div')(({ columns, rows }) => ({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
}))

const SubPlot = styled('div')`
  height: 100%;
  display: flex;
  flexDirection: column;
  justifyContent: center;
  position: relative;
`

const DynamicPadding = styled('div')(({ size }) => ({
  width: '100%',
  height: '100%',
  padding: `clamp(0px, ${100 - (MIN_SIZE + size * (MAX_SIZE - MIN_SIZE))}%, 5rem)`,
}))

const PlotTitle = styled('div')(({ x, y }) => ({
  color: '#4d4d4d',
  fontWeight: 'bold',
  position: 'absolute',
  overflow: 'visible',
  display: 'inline-block',
  zIndex: '10',
  width: '100%',
  textAlign: x === 0
    ? 'left'
    : x === 1
      ? 'right'
      : 'center',
  ...(
    y >= 0.5
      ? { bottom: `${100 * y}%` }
      : { top: `${100 * (1 - y)}%` }
  ),
}))

const Plot = styled('div')`
  width: 100%;
  overflow: hidden;
  flex: 1;
`


export default {
  Wrapper,
  SubPlotGrid,
  SubPlot,
  DynamicPadding,
  PlotTitle,
  Plot,
}
