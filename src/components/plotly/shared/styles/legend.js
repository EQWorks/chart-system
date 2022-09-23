import { styled } from 'goober'
import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import DivBase from '../div-base'

export default {
  LegendContainer: styled(DivBase)(({ margin, x, y }) => {
    const horizontal = !(y % 1)
    let positionStyle = {
      flexDirection: horizontal ? 'row' : 'column',
      order: horizontal ? +!y : x,
    }
    if (horizontal && !(x % 1)) {
      positionStyle.justifyContent = ['start', 'end'][x]
    }
    const marginAmount = `${100 * margin}%`
    const finalMargin = horizontal ? `0.2rem ${marginAmount}` : `${marginAmount} 0.2rem`
    return {
      transition: 'margin 0.3s',
      margin: finalMargin,
      minHeight: '2rem',
      flexWrap: 'wrap',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'auto',
      color: getTailwindConfigColor('secondary-600'),
      fontWeight: 600,
      fontSize: '0.8rem',
      position: 'relative',
      textTransform: 'capitalize',
      ...positionStyle,
    }
  }),

  LegendItem: styled(DivBase)({
    display: 'flex',
    margin: '0.2rem',
    alignItems: 'center',
  }),

  LegendColorBox: styled(DivBase)(({ rightAligned, color }) => {
    return {
      order: + !rightAligned,
      background: color,
      borderRadius: '0.2rem',
      width: '1rem',
      height: '1rem',
      margin: '0 0.5rem',
    }
  }),

  LegendString: styled(DivBase)(({ rightAligned }) => {
    return {
      order: + rightAligned,
      textAlign: rightAligned ? 'right' : 'left',
      flex: 1,
    }
  }),
}
