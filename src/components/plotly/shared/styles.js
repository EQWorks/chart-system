import { createElement, forwardRef } from 'react'
import { setup, styled } from 'goober'


setup(createElement)

const MIN_SIZE = 60
const MAX_SIZE = 100

const Wrapper = styled('div', forwardRef)`
  height: 100%;
  width: 100%;
`

const SubPlotsWrapper = styled('div')(({ columns, rows }) => ({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  gridTemplateRows: `repeat(${rows}, 1fr)`,
}))

const SubPlotInnerWrapper = styled('div')`
  position: relative;
  overflow: hidden;
`

const SizeablePlotWrapper = styled('div')(({ size }) => ({
  width: '100%',
  height: '100%',
  padding: `${100 - (MIN_SIZE + size * (MAX_SIZE - MIN_SIZE))}%`,
}))


export default {
  Wrapper,
  SubPlotsWrapper,
  SubPlotInnerWrapper,
  SizeablePlotWrapper,
}
