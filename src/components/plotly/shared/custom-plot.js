import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useResizeDetector } from 'react-resize-detector'

import getColorScheme from './get-color-scheme'
import styles from './styles'
import PlotlyWrapper from './plotly-wrapper'

const SHOW_COLOR_PALETTE = true

const CustomPlot = ({
  type,
  data,
  layout,
  subPlots,
  size,
  titlePosition,
  showVizTitles,
  baseColor,
  colorsNeeded,
  ...props
}) => {
  const { width, ref } = useResizeDetector({})
  const doSubPlots = useMemo(() => data.length > 1 && subPlots, [data.length, subPlots])
  const subPlotColumns = 2
  const subPlotRows = useMemo(() => Math.ceil(data.length / subPlotColumns), [data.length])

  const colors = useMemo(() => getColorScheme(baseColor, colorsNeeded), [baseColor, colorsNeeded])

  const transformedData = useMemo(() => (
    doSubPlots ?
      data.map((obj, i) => ({
        type,
        ...(
          type === 'pie'
            ? {
              domain: {
                column: i % subPlotColumns,
                row: Math.floor(i / subPlotColumns),
              },
            } : {
              xaxis: `x${i + 1}`,
              yaxis: `y${i + 1}`,
            }
        ),
        marker: {
          ...obj.marker,
          color: colors[i],
          colors,
        },
        ...obj,
      }))
      :
      data.map((obj, i) => ({
        type,
        marker: {
          ...obj.marker,
          color: colors[i],
          colors,
        },
        ...obj,
      }))
  ), [colors, data, doSubPlots, type])

  const renderTitle = (title) => (
    <styles.PlotTitle
      x={titlePosition[0]}
      y={titlePosition[1]}
    >
      {title}
    </styles.PlotTitle>
  )

  const renderColorPalette = (
    <div style={{
      position: 'absolute',
      display: 'flex',
    }}
    >
      {colors.map(c => (
        <div key={c} style={{
          marginRight: '0.5rem',
          position: 'relative',
          background: c,
          width: '1rem',
          height: '1rem',
          zIndex: 100,
        }} />
      ))}
    </div>
  )

  return doSubPlots
    ? <styles.SubPlotGrid columns={subPlotColumns} rows={subPlotRows}>
      {SHOW_COLOR_PALETTE && renderColorPalette}
      {
        transformedData.map((d, i) => (
          <styles.DynamicPadding key={i} size={size}>
            <styles.SubPlot>
              {showVizTitles && renderTitle(d.name)}
              <PlotlyWrapper
                data={[d]}
                layout={{
                  showlegend: false,
                  margin: { b: 0, t: 0, l: 0, r: 0 },
                }}
                {...props}
              />
            </styles.SubPlot>
          </styles.DynamicPadding>
        ))
      }
    </styles.SubPlotGrid >
    : <styles.Wrapper ref={ref} >
      {SHOW_COLOR_PALETTE && renderColorPalette}
      {showVizTitles && renderTitle(data[0].name)}
      <PlotlyWrapper
        data={transformedData}
        layout={{
          width,
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            xanchor: 'right',
            y: 1,
            x: 1,
          },
        }}
        style={{ height: 'inherit' }}
        {...props}
      />
    </styles.Wrapper>
}

CustomPlot.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  layout: PropTypes.object,
  subPlots: PropTypes.bool,
  titlePosition: PropTypes.arrayOf(PropTypes.number),
  showVizTitles: PropTypes.bool,
  size: PropTypes.number,
  baseColor: PropTypes.string,
  colorsNeeded: PropTypes.number,
}

CustomPlot.defaultProps = {
  layout: {},
  subPlots: false,
  titlePosition: [0, 1],
  showVizTitles: true,
  size: 0.8,
  baseColor: '#0017ff',
  colorsNeeded: 12,
}

export default CustomPlot
