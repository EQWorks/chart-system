import React, { useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import Plotly from 'plotly.js-basic-dist-min'

import Styles from './styles'


// credit JamesRamm
// https://github.com/plotly/react-plotly.js/issues/242
const Plot = ({ data, layout, config, onAfterPlot }) => {
  const [ref, setRef] = useState(null)

  useLayoutEffect(() => {
    try {
      if (data && layout && config && ref) {
        Plotly.react(ref, { data, layout, config })
          .then((res) => { 
            onAfterPlot({ response: res, isLoading: false })
          })
          .catch((err) => {
            onAfterPlot({ response: err, isLoading: false })
          })
      }
    } catch (e) {
      // don't crash on errors
    }

    return () => {
      ref && Plotly.purge(ref)
    }
  }, [ref, data, layout, config, onAfterPlot])

  return <Styles.Plot ref={setRef} />
}

Plot.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
  config: PropTypes.object,
  onAfterPlot: PropTypes.func,
}
Plot.defaultProps = {
  data: null,
  layout: null,
  config: null,
  onAfterPlot: () => {},
}

export default Plot
