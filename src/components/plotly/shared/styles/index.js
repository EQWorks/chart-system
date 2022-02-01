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
  OuterContainer: styled('div')({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
}
