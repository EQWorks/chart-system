import React, { useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import Plotly from 'plotly.js-basic-dist-min'
import styles from './styles'

// credit JamesRamm
// https://github.com/plotly/react-plotly.js/issues/242
const Plot = ({ square, data, layout, config }) => {
  const [ref, setRef] = useState(null)
  useLayoutEffect(() => {
    ref && Plotly.react(ref, { data, layout, config })
    return () => {
      ref && Plotly.purge(ref)
    }
  }, [ref, data, layout, config])
  return <styles.Plot square={square} ref={setRef} />
}

Plot.propTypes = {
  square: PropTypes.bool,
  data: PropTypes.object,
  layout: PropTypes.object,
  config: PropTypes.object,
}

export default Plot
