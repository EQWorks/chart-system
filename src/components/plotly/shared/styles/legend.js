import { styled } from 'goober'
import { getTailwindConfigColor } from '@eqworks/lumen-labs'

export default {
  LegendContainer: styled('div')(({ x, y }) => {
    const horizontal = !(y % 1)
    let positionStyle = {
      flexDirection: horizontal ? 'row' : 'column',
      order: horizontal ? +!y : x,
    }
    if (horizontal && !(x % 1)) {
      positionStyle.justifyContent = ['start', 'end'][x]
    }
    return {
      minHeight: '2rem',
      flexWrap: 'wrap',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'auto',
      color: getTailwindConfigColor('secondary-600'),
      fontWeight: 600,
      fontSize: '0.8rem',
      position: 'relative',
      ...positionStyle,
    }
  }),

  LegendItem: styled('div')({
    display: 'flex',
    margin: '0.2rem',
    alignItems: 'center',
  }),

  LegendColorBox: styled('div')(({ color, rightAligned }) => ({
    order: + !rightAligned,
    background: color,
    borderRadius: '0.2rem',
    width: '1rem',
    height: '1rem',
    margin: '0 0.5rem',
  })),

  LegendString: styled('div')(({ rightAligned }) => ({
    order: + rightAligned,
    textAlign: rightAligned ? 'right' : 'left',
    flex: 1,
  })),
}
