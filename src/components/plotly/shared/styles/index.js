import { createElement } from 'react'
import { setup, styled } from 'goober'

import plotStyles from './plot'
import legendStyles from './legend'
import utilStyles from './util'
import DivBase from '../div-base'

setup(createElement)

export default {
  ...plotStyles,
  ...legendStyles,
  ...utilStyles,
  OuterContainer: styled(DivBase)(({ showLegend, legendPosition: [lX, lY] }) => {
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
  GenericContainer: styled(DivBase)({
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'width 0.3s, height 0.3s',
  }),
  ContentContainer: styled(DivBase)({
    fontFamily: 'Open Sans,sans-serif',
    position: 'relative',
    order: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'capitalize',
  }),
}
