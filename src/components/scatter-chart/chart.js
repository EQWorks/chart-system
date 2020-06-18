import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'

import designSystemColors from '../../shared/constants/design-system-colors'
import { getCommonProps } from '../../shared/utils'


// sets common props for Nivo ResponsiveScatterPlot component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => ({
  xScale: { type: 'linear' },
  yScale: { type: 'linear' },
  colors: [
    designSystemColors.blue70,
    designSystemColors.pink70,
    designSystemColors.teal70
  ],
  nodeSize: 8,
  onMouseEnter,
  onMouseLeave,
  useMesh: false,
  ...getCommonProps({
    data,
    height,
    width,
    axisBottomLegendLabel,
    axisLeftLegendLabel,
    dash: true,
    tickValues: data[0].data.length,
  })
})

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

const defaultProps = {
  axisBottomLegendLabel: '',
  axisLeftLegendLabel: '',
  width: 100,
  height: 100,
}

// ScatterChart - creates a scatter chart
const ScatterChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
}) => {
  /**
   * initRef - React ref used to target and trim Legend labels
   * @param { number } width - width of the chart container (ChartInner)
   * @param { number } heigth - height of the chart container (ChartInner)
   * @param { html } node - Legend html node
   */
  const initRef = useCallback((width, height) => node => {
    if ((node !== null) && (width >= WIDTH_BREAKPOINT_0)) {
      const text = Array.from(node.parentNode.children).find(tag => tag.tagName === 'text')
      if (text) {
        // set its original value as attribute, so that we don't keep repeating
        if (!text.getAttribute('og-key')) {
          text.setAttribute('og-key', text.innerHTML)
        }
        let original = text.getAttribute('og-key') || text.innerHTML
        // need to only measure length of the key without the '..'
        if (original.endsWith('..')) {
          original = original.split('..')[0]
        }
        let labelWidth = getTextSize(original, '12px noto sans')
        // MY SOLUTION
        // let labelContainer = isAspectRatio(width, height, aspectRatios.LANDSCAPE) ?
        // // we only want to start trimming for column legend when width >= WIDTH_BREAKPOINT_3
        //   ((width >= WIDTH_BREAKPOINT_3) ?
        //     width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH :
        //     0):
        //   setLegendItemWidth(width, height) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH

        // Do's design
        let labelContainer = isAspectRatio(width, height, aspectRatios.LANDSCAPE) ?
        // we only want to start trimming for column legend when width >= WIDTH_BREAKPOINT_3
          ((width >= WIDTH_BREAKPOINT_3) ?
            width - WIDTH_BREAKPOINT_3 + TRIMMED_LEGEND_WIDTH :
            0):
          ((width >= WIDTH_BREAKPOINT_3) ?
            setLegendItemWidth(width, height) - LEGEND_ROW_FIXED_ELEMENTS_WIDTH :
            72 - LEGEND_ROW_FIXED_ELEMENTS_WIDTH)
        let label = original
        if (labelContainer && (labelWidth > labelContainer)) {
          label = trimText(original, labelContainer)
        }
        text.innerHTML = label
      }
    }
  }, [])
  return (
    <ResponsiveScatterPlot
      {...setCommonProps(width, height, data, axisBottomLegendLabel, axisLeftLegendLabel, initRef)}
      tooltip={({ node }) => (
        <Tooltip
          label={node.id.split('.')[0]}
          color={node.style.color}
          display={[
            { label: axisBottomLegendLabel, value: node.data.formattedX },
            { label: axisLeftLegendLabel, value: node.data.formattedY },
          ]}
        />
      )}
    >
    </ResponsiveScatterPlot>
  )
}

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default ScatterChart
