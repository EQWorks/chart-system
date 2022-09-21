import React, { useState, useMemo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import merge from 'lodash.merge'
import { useResizeDetector } from 'react-resize-detector'

import getColorScheme from './get-color-scheme'
import Legend from './legend'
import { PLOTLY_BASE_LAYOUT, plotlyInterfaces } from './constants'
import Plot from './plot'
import Styles from './styles'

const DEFAULT_SIZE = 0.8 // [0, 1]
const MIN_SIZE = 0.5 // [0, 1]

const SUBPLOT_COLUMNS = 2

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
  const finalVizSize = useMemo(() => (
    doSubPlots
      ? MIN_SIZE + (size * (1 - MIN_SIZE))
      : DEFAULT_SIZE
  ), [doSubPlots, size])
  const legendMargin = useMemo(() => (
    doSubPlots
      ? (1 - finalVizSize) / SUBPLOT_COLUMNS / 2
      : (1 - finalVizSize) / 2
  ), [doSubPlots, finalVizSize])
  const subPlotRows = useMemo(() => Math.ceil(data.length / SUBPLOT_COLUMNS), [data.length])

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
    <Styles.PlotTitle
      x={titlePosition[0]}
      y={titlePosition[1]}
    >
      {title}
    </Styles.PlotTitle>
  )

  // render a dummy element with the ref from react-resize-detector.
  const renderDummy = (
    <Styles.PlotContainer>
      <Styles.DynamicSize ref={ref} size={finalVizSize} >
        {renderTitle(' ')}
        <Styles.Plot />
      </Styles.DynamicSize>
    </Styles.PlotContainer>
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
        <Styles.ManualDimensions {...manualDimensions}>
          {children}
        </Styles.ManualDimensions>
      )
      : children
  )

  // render a plotly.js visualization with a title and dynamic padding
  const renderPlot = (data, title, key) => (
    <Styles.PlotContainer key={key}>
      {
        applyManualDimensions(
          <Styles.DynamicSize size={finalVizSize} >
            {renderTitle(title)}
            <Plot
              data={data}
              layout={finalLayout}
              config={{
                displayModeBar: false,
                responsive: true,
              }}
            />
          </Styles.DynamicSize>,
        )
      }
    </Styles.PlotContainer>
  )

  return (
    <Styles.OuterContainer showLegend={showLegend} legendPosition={legendPosition}>
      <Styles.ContentContainer>
        {
          doSubPlots
            ? <>
              <Styles.SubPlotGrid columns={SUBPLOT_COLUMNS} rows={subPlotRows}>
                {coloredData.map((d, i) => renderPlot([d], d.name, i))}
              </Styles.SubPlotGrid >
              <Styles.HiddenContainer>
                <Styles.SubPlotGrid columns={SUBPLOT_COLUMNS} rows={subPlotRows}>
                  {renderDummy}
                </Styles.SubPlotGrid >
              </Styles.HiddenContainer>
            </>
            : <>
              {renderPlot(coloredData, data[0].name)}
              <Styles.HiddenContainer>
                {renderDummy}
              </Styles.HiddenContainer>
            </>
        }
      </Styles.ContentContainer>
      {
        showLegend &&
        <Legend
          margin={legendMargin}
          colors={colors}
          keys={legendKeys}
          position={legendPosition}
        />
      }
    </Styles.OuterContainer>
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
