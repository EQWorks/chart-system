import React, { useState, useMemo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import merge from 'lodash.merge'
import { useResizeDetector } from 'react-resize-detector'

import getColorScheme from './get-color-scheme'
import Legend from './legend'
import { PLOTLY_BASE_LAYOUT, plotlyInterfaces } from './constants'
import Plot from './plot'
import styles from './styles'


const CustomPlot = ({
  type,
  data,
  layout,
  subPlots,
  size,
  titlePosition,
  legendPosition,
  showVizTitles,
  baseColor,
  showLegend,
}) => {
  // determine subplot requirements
  const doSubPlots = useMemo(() => data.length > 1 && subPlots, [data.length, subPlots])
  const finalSize = useMemo(() => doSubPlots ? size : 0.8, [doSubPlots, size])
  const subPlotColumns = 2
  const subPlotRows = useMemo(() => Math.ceil(data.length / subPlotColumns), [data.length])

  // memoize layout object
  const finalLayout = useMemo(() => merge(layout, PLOTLY_BASE_LAYOUT), [layout])

  // determine the keys for the legend
  const legendKeys = useMemo(() => plotlyInterfaces[type].getLegendKeys(data), [data, type])

  // generate the color scheme based on a single base color
  const colors = useMemo(() => getColorScheme(baseColor, legendKeys.length), [baseColor, legendKeys.length])

  // enrich the data with color values
  const coloredData = useMemo(() => (
    data.map((obj, i) => ({
      type,
      marker: {
        ...obj.marker,
        color: colors[i],
        colors, // plotly uses both 'color' and 'colors' depending on the chart type
      },
      ...obj,
    }))
  ), [colors, data, type])

  // keep track of example viz container height and width for computing manual size
  // also, ref helps force plotly to redraw during padding transitions 
  const { ref, width, height } = useResizeDetector()

  const renderTitle = (title = '') => (
    showVizTitles &&
    <styles.PlotTitle
      x={titlePosition[0]}
      y={titlePosition[1]}
    >
      {title}
    </styles.PlotTitle>
  )

  // render a dummy element with the ref from react-resize-detector.
  const renderDummy = (
    <styles.PlotContainer>
      <styles.DynamicSize ref={ref} size={finalSize} >
        {renderTitle(' ')}
        <styles.Plot />
      </styles.DynamicSize>
    </styles.PlotContainer>
  )

  // set manual height and width for special cases
  const [manualDimensions, setManualDimensions] = useState()
  useLayoutEffect(() => {
    if (type === 'pie') {
      if (width && height) {
        setManualDimensions(
          width <= height
            ? { height: `${width}px` }
            : { width: `${height}px` },
        )
      }
    } else {
      setManualDimensions(null)
    }
  }, [height, type, width])

  // util to apply manual dimensions only if they are defined
  const applyManualDimensions = children => (
    manualDimensions
      ? (
        <styles.ManualDimensions {...manualDimensions}>
          {children}
        </styles.ManualDimensions>
      )
      : children
  )

  // render a plotly.js visualization with a title and dynamic padding
  const renderPlot = (data, title, key) => (
    <styles.PlotContainer key={key}>
      {
        applyManualDimensions(
          <styles.DynamicSize size={finalSize} >
            {renderTitle(title)}
            <Plot
              data={data}
              layout={finalLayout}
              config={{
                displayModeBar: false,
                responsive: true,
              }}
            />
          </styles.DynamicSize>,
        )
      }
    </styles.PlotContainer>
  )

  return (
    <styles.OuterContainer showLegend={showLegend} legendPosition={legendPosition}>
      <styles.ContentContainer>
        {
          doSubPlots
            ? <>
              <styles.SubPlotGrid columns={subPlotColumns} rows={subPlotRows}>
                {coloredData.map((d, i) => renderPlot([d], d.name, i))}
              </styles.SubPlotGrid >
              <styles.HiddenContainer>
                <styles.SubPlotGrid columns={subPlotColumns} rows={subPlotRows}>
                  {renderDummy}
                </styles.SubPlotGrid >
              </styles.HiddenContainer>
            </>
            : <>
              {renderPlot(coloredData, data[0].name)}
              <styles.HiddenContainer>
                {renderDummy}
              </styles.HiddenContainer>
            </>
        }
      </styles.ContentContainer>
      {
        showLegend &&
        <Legend
          colors={colors}
          keys={legendKeys}
          position={legendPosition}
        />
      }
    </styles.OuterContainer>
  )
}

CustomPlot.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  subPlots: PropTypes.bool,
  layout: PropTypes.object,
  style: PropTypes.object,
  titlePosition: PropTypes.arrayOf(PropTypes.number),
  legendPosition: PropTypes.arrayOf(PropTypes.number),
  showLegend: PropTypes.bool,
  showVizTitles: PropTypes.bool,
  size: PropTypes.number,
  baseColor: PropTypes.string,
}

CustomPlot.defaultProps = {
  subPlots: false,
  layout: {},
  style: {},
  titlePosition: [0, 1],
  legendPosition: [1, 0],
  showVizTitles: true,
  size: 0.8,
  baseColor: '#0017ff',
  showLegend: true,
}

export default CustomPlot
