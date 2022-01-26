import React, { useMemo } from 'react'
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
  // subplot configuration
  const doSubPlots = useMemo(() => data.length > 1 && subPlots, [data.length, subPlots])
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

  // ref helps force DOM reflows during padding transitions 
  const { ref, width, height } = useResizeDetector()

  // special styling is needed for square visualizations due to plotly.js deficiencies 
  // however, this should only be applied if the container is taller than it is wide
  const isSquare = useMemo(() => (
    type === 'pie' && width <= height
  ), [height, width, type])

  // render a dummy element with the ref from react-resize-detector.
  const renderDummy = (
    <styles.DynamicPadding size={size}>
      <styles.RefDummy ref={ref} />
    </styles.DynamicPadding>
  )

  // render a plotly.js visualization with a title and dynamic padding
  const renderPlot = (data, title) => (
    <styles.DynamicPadding size={size}>
      <styles.PlotContainer square={isSquare}>
        {isSquare && <styles.SquareHeightDummy />}
        {showVizTitles &&
          <styles.PlotTitle
            x={titlePosition[0]}
            y={titlePosition[1]}
            absolute={isSquare}
          >
            {title}
          </styles.PlotTitle>
        }
        <Plot
          square={isSquare}
          data={data}
          layout={finalLayout}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
        />
      </styles.PlotContainer>
    </styles.DynamicPadding >
  )

  return (
    <styles.OuterContainer>
      {
        doSubPlots
          ? <>
            <styles.SubPlotGrid columns={subPlotColumns} rows={subPlotRows}>
              {coloredData.map(d => renderPlot([d], d.name))}
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
