import { createElement } from 'react'
import { setup, styled } from 'goober'

import plotStyles from './plot'
import legendStyles from './legend'
import utilStyles from './util'

setup(createElement)

export default {
  ...plotStyles,
  ...legendStyles,
  ...utilStyles,
  OuterContainer: styled('div')(({ showLegend, legendPosition: [lX, lY] }) => {
    let gridStyle = {}
    if (showLegend) {
      if (lY === 1) {
        gridStyle = { gridTemplateRows: 'fit-content(20%) 1fr' }
      } else if (lY === 0) {
        gridStyle = { gridTemplateRows: '1fr fit-content(20%)' }
      } else if (lX > 0.5) {
        gridStyle = { gridTemplateColumns: '1fr fit-content(20%)' }
      } else {
        gridStyle = { gridTemplateColumns: 'fit-content(20%) 1fr' }
      }
    }
    return {
      width: '100%',
      height: '100%',
      display: 'grid',
      overflow: 'auto',
      ...gridStyle,
    }
  }),
  ContentContainer: styled('div')({
    fontFamily: 'Open Sans,sans-serif',
    position: 'relative',
    order: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  LineBreak: styled('div')({
    height: '100%',
    width: '1px',
    background: 'red',
  }),
}
