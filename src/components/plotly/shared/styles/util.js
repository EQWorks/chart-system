import { forwardRef } from 'react'
import { styled } from 'goober'

const MIN_SIZE = 50
const MAX_PADDING = 100 - MIN_SIZE

export default {
  DynamicSize: styled('div', forwardRef)(({ size }) => {
    const finalSize = `${MIN_SIZE + (size * MAX_PADDING)}%`
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
