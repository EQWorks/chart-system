import { createElement, forwardRef } from 'react'
import { setup, styled } from 'goober'


setup(createElement)

const MIN_SIZE = 60
const MAX_SIZE = 100

export default {
  SubPlotGrid: styled('div')(({ columns, rows }) => ({
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
  })),

  DynamicPadding: styled('div')(({ size }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    transition: 'padding 0.3s ease',
    padding: `clamp(0px, ${100 - (MIN_SIZE + size * (MAX_SIZE - MIN_SIZE))}%, 5rem)`,
  })),

  PlotTitle: styled('div')(({ x, y, absolute = true }) => ({
    color: '#4d4d4d',
    fontWeight: 'bold',
    zIndex: '10',
    width: '100%',
    overflow: 'visible',
    textAlign: x === 0
      ? 'left'
      : x === 1
        ? 'right'
        : 'center',
    ...(absolute
      ? {

        position: 'absolute',
        ...(y > 0.5
          ? {
            bottom: '100%',
            paddingBottom: '1rem',
          }
          : {
            top: '100%',
            paddingTop: '1rem',
          }
        ),
      }
      : {
        display: 'inline-block',
        order: + (y < 0.5),
      }
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

  Legend: styled('div')({
    background: 'white',
    border: 'solid',
    borderColor: 'black',
    borderRadius: '0.2rem',
    fontSize: '0.9rem',
    borderWidth: '1px',
    position: 'relative',
    overflow: 'visible',
    justifyContent: 'center',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
  }),

  LegendRow: styled('div')({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }),

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

  OuterContainer: styled('div')({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  PlotContainer: styled('div', forwardRef)(({ square }) => ({
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    flex: '1',
    ...(square
      ? {
        position: 'relative',
        '&:before': {
          display: 'block',
          content: '',
          float: 'left',
          paddingTop: '100%',
          marginTop: '-100%',
        },
      }
      : {
        height: '100%',
      }
    ),
  })),

  Plot: styled('div', forwardRef)(({ square }) => ({
    '& svg': {
      overflow: 'visible !important', // plotly.js override
    },
    ...(
      square
        ? {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }
        : {
          height: 'inherit',
        }
    ),
  })),

  HiddenContainer: styled('div')({
    pointerEvents: 'none',
    display: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
  }),

  RefDummy: styled('div', forwardRef)({
    width: '100%',
    height: '100%',
  }),

  // https://stackoverflow.com/a/6615994
  SquareHeightDummy: styled('div')({
    marginTop: '100%',
    visibility: 'hidden',
  }),

}
