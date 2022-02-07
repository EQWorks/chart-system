import { forwardRef } from 'react'
import { styled } from 'goober'
import { getTailwindConfigColor } from '@eqworks/lumen-labs'


const titleBase = (x, y) => ({
  background: 'rgba(255, 255, 255, 0.4)',
  padding: '0.2rem',
  borderRadius: '0.2rem',
  color: getTailwindConfigColor('secondary-900'),
  fontWeight: 700,
  fontSize: '1.5rem',
  zIndex: '10',
  overflow: 'visible',
  whiteSpace: 'nowrap',
  width: 'min-content',
  alignSelf:
    x === 0
      ? 'start'
      : x === 1
        ? 'end'
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
})

export default {
  SubPlotGrid: styled('div')(({ columns, rows }) => ({
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
  })),

  Title: styled('div')(({ x, y }) => ({
    ...titleBase(x, y),
    color: getTailwindConfigColor('secondary-900'),
    fontWeight: 700,
    fontSize: '1.3rem',
  })),

  SubPlotTitle: styled('div')(({ x, y }) => ({
    ...titleBase(x, y),
    color: getTailwindConfigColor('secondary-800'),
    fontWeight: 700,
    fontSize: '0.9rem',
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
