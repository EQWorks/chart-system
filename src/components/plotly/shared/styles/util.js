import { forwardRef } from 'react'
import { styled } from 'goober'

export default {
  DynamicPadding: styled('div')(({ size }) => {
    const padding = 1 - size
    return {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      transition: 'padding 0.3s ease',
      padding: `min(${padding * 30}%, 14rem)`,
    }
  }),

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

  ManualDimensions: styled('div')(({ width = '100%', height = '100%' }) => ({
    width,
    height,
  })),
}
