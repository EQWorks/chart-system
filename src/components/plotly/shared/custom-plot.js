import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useResizeDetector } from 'react-resize-detector'
import styles from './styles'

import PlotlyWrapper from './plotly-wrapper'

const CustomPlot = ({
  type,
  data,
  layout,
  subPlots,
  size,
  titlePosition,
  showVizTitles,
  colorsNeeded,
  ...props
}) => {
  const { width, ref } = useResizeDetector({})
  const doSubPlots = useMemo(() => data.length > 1 && subPlots, [data.length, subPlots])
  const subPlotColumns = 2
  const subPlotRows = useMemo(() => Math.ceil(data.length / subPlotColumns), [data.length])

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
        ...obj,
      }))
      :
      data.map(obj => ({ type, ...obj }))
  ), [data, doSubPlots, type])

  const renderTitle = (title) => (
    <styles.PlotTitle
      x={titlePosition[0]}
      y={titlePosition[1]}
    >
      {title}
    </styles.PlotTitle>
  )


  return doSubPlots
    ? <styles.SubPlotGrid columns={subPlotColumns} rows={subPlotRows}>
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
  colorsNeeded: PropTypes.number,
}

CustomPlot.defaultProps = {
  layout: {},
  subPlots: false,
  titlePosition: [0, 1],
  showVizTitles: true,
  size: 0.8,
  colorsNeeded: 12,
}

export default CustomPlot
