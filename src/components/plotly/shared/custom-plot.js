import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Plotly from 'plotly.js-basic-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'
import merge from 'lodash.merge'

import getColorScheme from './get-color-scheme'
import styles from './styles'
import Legend from './legend'
import { plotlyInterfaces } from './constants'

const Plot = createPlotlyComponent(Plotly)

const CustomPlot = ({
  type,
  data,
  layout,
  subPlots,
  size,
  style,
  titlePosition,
  legendPosition,
  showVizTitles,
  baseColor,
  showLegend,
  ...props
}) => {
  const doSubPlots = useMemo(() => data.length > 1 && subPlots, [data.length, subPlots])
  const subPlotColumns = 2
  const subPlotRows = useMemo(() => Math.ceil(data.length / subPlotColumns), [data.length])

  // TODO standardize among all types, or encapsulate in constants/plotlyInterfaces
  const legendKeys = useMemo(() => (type === 'pie'
    ? data[0][plotlyInterfaces[type].domain.output]
    : data.map(({ name }) => name)
  ), [data, type])
  const colors = useMemo(() => getColorScheme(baseColor, legendKeys.length), [baseColor, legendKeys.length])

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

  const renderTitle = (title) => (
    <styles.PlotTitle
      x={titlePosition[0]}
      y={titlePosition[1]}
    >
      {title}
    </styles.PlotTitle>
  )

  const renderPlot = data => (
    <styles.Plot>
      <Plot
        data={data}
        layout={
          merge(layout, {
            showlegend: false,
            autosize: true,
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            modebar: {
              bgcolor: 'transparent',
              color: 'black',
              activecolor: 'black',
            },
          })
        }
        style={{
          width: '100%',
          height: '100%',
          ...style,
        }}
        config={{
          displayModeBar: false,
        }}
        {...props}
      />
    </styles.Plot>
  )

  const renderMultipleViz = (
    <styles.SubPlotGrid columns={subPlotColumns} rows={subPlotRows}>
      {
        coloredData.map((d, i) => (
          <styles.DynamicPadding key={i} size={size}>
            <styles.SubPlot>
              {showVizTitles && renderTitle(d.name)}
              {renderPlot([d])}
            </styles.SubPlot>
          </styles.DynamicPadding>
        ))
      }
    </styles.SubPlotGrid >
  )

  const renderSingleViz = (
    <styles.Wrapper >
      {showVizTitles && renderTitle(data[0].name)}
      {/* <styles.DynamicPadding size={size}> */}
      {renderPlot(coloredData)}
      {/* </styles.DynamicPadding> */}
    </styles.Wrapper>
  )

  return (
    <styles.OuterContainer>
      {
        doSubPlots
          ? renderMultipleViz
          : renderSingleViz
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
