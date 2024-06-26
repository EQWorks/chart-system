import { styled } from 'goober'
import { getTailwindConfigColor } from '@eqworks/lumen-labs'

export default {
  LegendContainer: styled('div')(({ margin, x, y }) => {
    const horizontal = !(y % 1)
    let positionStyle = {
      flexDirection: horizontal ? 'row' : 'column',
      order: horizontal ? +!y : x,
    }

    const marginAmount = `${100 * margin}%`
    const finalMargin = horizontal ? `1rem ${marginAmount} 0.6rem ${marginAmount}` : 
      `${marginAmount} 0.6rem`
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
      ...positionStyle,
    }
  }),

  LegendItem: styled('div')({
    display: 'flex',
    marginRight: '1rem',
    alignItems: 'center',
  }),

  LegendColorBox: styled('div')(({ color }) => ({
    background: color,
    borderRadius: '0.5rem',
    width: '0.625rem',
    height: '0.625rem',
    marginRight: '0.313rem',
  })),

  LegendString: styled('div')({
    textAlign: 'left',
    flex: 1,
    fontSize: '0.688rem',
    lineHeight: '1rem',
    letterSpacing: '0.025rem',
  }),
}
