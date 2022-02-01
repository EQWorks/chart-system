import { styled } from 'goober'

export default {
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
}
