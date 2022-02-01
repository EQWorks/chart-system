import React, { useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import Plotly from 'plotly.js-basic-dist-min'

import styles from './styles'

// credit JamesRamm
// https://github.com/plotly/react-plotly.js/issues/242
const Plot = ({ data, layout, config }) => {
  const [ref, setRef] = useState(null)
  useLayoutEffect(() => {
    try {
      if (data && layout && config) {
        ref && Plotly.react(ref, { data, layout, config }).catch(() => { })
      }
    } catch (e) {
      // don't crash on errors
    }
    return () => {
      ref && Plotly.purge(ref)
    }
  }, [ref, data, layout, config])
  return <styles.Plot ref={setRef} />
}

Plot.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
  config: PropTypes.object,
}
Plot.defaultProps = {
  data: null,
  layout: null,
  config: null,
}

export default Plot
