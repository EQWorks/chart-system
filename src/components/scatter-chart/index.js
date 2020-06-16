import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import styled from 'styled-components'

import 'react-virtualized/styles.css'
import { AutoSizer } from 'react-virtualized'

import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'

import designSystemColors from '../../shared/constants/design-system-colors'
import { getCommonProps } from '../../shared/utils'


// define styled elements
const Title = styled.div`
  margin: 16px 16px 10px 16px;
  height: 24px;
  font-size: 18px;
`

const ChartContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  margin: 0px 16px 16px 16px;
`

const ChartInner = styled.div`
  position: relative;
  width: ${ props => props.width}px;
  height: ${ props => props.height}px;
`

// sets common props for Nivo ResponsiveScatterPlot component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel, ref) => ({
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
    ref,
  })
})

const propTypes = {
  data: PropTypes.array,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string,
}

// ScatterChart - creates a scatter chart
const ScatterChart = ({
  data,
  axisBottomLegendLabel,
  axisLeftLegendLabel
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
    <>
      <Title>
        Test
      </Title>
      <ChartContainer>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner id='chart-inner' height={height} width={width}>
              <ResponsiveScatterPlot
                {...setCommonProps(width, height, data, axisBottomLegendLabel, axisLeftLegendLabel, initRef(width, height))}
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
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </>
  )
}

export default ScatterChart

ScatterChart.propTypes = propTypes
