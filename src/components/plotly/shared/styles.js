import { createElement, forwardRef } from 'react'
import { setup, styled } from 'goober'


setup(createElement)

const MIN_SIZE = 60
const MAX_SIZE = 100

export default {

  Wrapper: styled('div', forwardRef)`
    height: 100%;
    width: 100%;
    display: flex;
    alignItems: center;
    justifyContent: center;
  `,

  SubPlotGrid: styled('div')(({ columns, rows }) => ({
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
  })),

  SubPlot: styled('div')`
    height: 100%;
    display: flex;
    flexDirection: column;
    justifyContent: center;
    position: relative;
  `,

  DynamicPadding: styled('div')(({ size }) => ({
    width: '100%',
    height: '100%',
    padding: `clamp(0px, ${100 - (MIN_SIZE + size * (MAX_SIZE - MIN_SIZE))}%, 5rem)`,
  })),

  PlotTitle: styled('div')(({ x, y }) => ({
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
  })),

  LegendContainer: styled('div')(({ x, y }) => ({
    zIndex: 30,
    transition: 'opacity 1s',
    transitionDelay: '1s',
    '&:hover': {
      opacity: 0.6,
    },
    position: 'absolute',
    ...(
      x >= 0.5
        ? { right: `${100 * (1 - x)}%` }
        : { left: `${100 * x}%` }
    ),
    ...(
      y >= 0.5
        ? { top: `${100 * (1 - y)}%` }
        : { bottom: `${100 * y}%` }
    ),
  })),

  Legend: styled('div')`
    background: white;
    border: solid;
    borderColor: black;
    borderRadius: 0.2rem;
    fontSize: 0.9rem;
    borderWidth: 1px;
    position: relative;
    overflow: visible;
    justifyContent: center;
    padding: 1rem;
    display: flex;
    flexDirection: column;
  `,

  LegendRow: styled('div')`
    display: flex;
    alignItems: center;
    width: 100%;
  `,

  LegendColorBox: styled('div')(({ color, rightAligned }) => ({
    order: + !rightAligned,
    background: color,
    borderRadius: '0.2rem',
    width: '1rem',
    height: '1rem',
    ...(rightAligned
      ? { marginRight: '0.7rem' }
      : { marginLeft: '0.7rem' }
    ),
  })),

  LegendString: styled('div')(({ rightAligned }) => ({
    order: + rightAligned,
    textAlign: rightAligned ? 'right' : 'left',
    flex: 1,
  })),

  OuterContainer: styled('div')`
    width: 100%;
    height: 100%;
    display: flex;
    alignItems: center;
    justifyContent: center;
  `,

  Plot: styled('div')`
    width: 100%;
    height: 100%;
    overflow: hidden;
    flex: 1;
  `,
}
