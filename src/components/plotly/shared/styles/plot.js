import { forwardRef } from 'react'
import { styled } from 'goober'

export default {
  SubPlotGrid: styled('div')(({ columns, rows }) => ({
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
  })),

  PlotTitle: styled('div')(({ x, y }) => ({
    color: '#4d4d4d',
    fontWeight: 'bold',
    zIndex: '10',
    width: '100%',
    overflow: 'visible',
    textAlign:
      x === 0
        ? 'left'
        : x === 1
          ? 'right'
          : 'center',
    ...(y > 0.5
      ? {
        order: 0,
        paddingBottom: '1rem',
      }
      : {
        order: 1,
        paddingTop: '1rem',
      }
    ),
  })),

  PlotContainer: styled('div')({
    width: 'inherit',
    height: 'inherit',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  }),

  Plot: styled('div', forwardRef)({
    '& svg': {
      overflow: 'visible !important', // plotly.js override
    },
    height: 'inherit',
    width: 'inherit',
  }),
}
