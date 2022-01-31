import { forwardRef } from 'react'
import { styled } from 'goober'


export default {
  DynamicSize: styled('div', forwardRef)(({ size }) => {
    const finalSize = `${size * 100}%`
    return {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      position: 'relative',
      width: finalSize,
      height: finalSize,
      maxWidth: '100%',
      maxHeight: '100%',
      transition: 'width 0.3s, height 0.3s',
    }
  }),

  HiddenContainer: styled('div')({
    pointerEvents: 'none',
    visibility: 'hidden',
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })),
}
