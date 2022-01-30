import { forwardRef } from 'react'
import { styled } from 'goober'
import { getTailwindConfigColor } from '@eqworks/lumen-labs'

export default {
  SubPlotGrid: styled('div')(({ columns, rows }) => ({
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
  })),

  PlotTitle: styled('div')(({ x, y }) => ({
    background: 'white',
    padding: '0.2rem',
    borderRadius: '0.2rem',
    color: getTailwindConfigColor('secondary-800'),
    fontWeight: 700,
    zIndex: '10',
    overflow: 'visible',
    whiteSpace: 'nowrap',
    textAlign:
      x === 0
        ? 'left'
        : x === 1
          ? 'right'
          : 'center',
    ...(y > 0.5
      ? {
        order: 0,
        marginBottom: '1rem',
      }
      : {
        order: 1,
        marginTop: '1rem',
      }
    ),
  })),

  PlotContainer: styled('div', forwardRef)({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),

  Plot: styled('div', forwardRef)({
    '& svg': {
      overflow: 'visible !important', // plotly.js override
    },
    flex: 1,
    minHeight: '10px',
    minWidth: '10px',
    width: '100%',
  }),
}
