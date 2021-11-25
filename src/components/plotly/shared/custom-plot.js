import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import styles from './styles'

import PlotlyWrapper from './plotly-wrapper'

const CustomPlot = ({
  type,
  data,
  layout,
  subPlots,
  size,
  titleX,
  titleY,
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

  const renderTitle = (title) =>
    <div style={{
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'end',
      width: '100%',
      height: `${100 * (1 - titleY)}% `,
      textAlign: 'center',
      overflow: 'visible',
      zIndex: '10',
    }}>
      <span
        style={{
          position: 'absolute',
          top: `${100 * (1 - titleY)}% `,
          left: `${100 * (titleX - 0.5)}% `,
          width: '100%',
        }}>
        {title}
      </span>
    </div>

  return doSubPlots
    ? <styles.SubPlotsWrapper columns={subPlotColumns} rows={subPlotRows}>
      {
        transformedData.map((d, i) => (
          <styles.SubPlotInnerWrapper key={i} >
            {renderTitle(d.name)}
            <styles.SizeablePlotWrapper size={size}>
              <PlotlyWrapper
                data={[d]}
                style={{ width: '100%', height: '100%' }}
                layout={{
                  showlegend: false,
                  margin: { b: 0, t: 0, l: 0, r: 0 },
                }}
                {...props}
              />
            </styles.SizeablePlotWrapper>
          </styles.SubPlotInnerWrapper>
        ))
      }
    </styles.SubPlotsWrapper >
    : <styles.Wrapper ref={ref} >
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
  titleX: PropTypes.number,
  titleY: PropTypes.number,
  size: PropTypes.number,
}

CustomPlot.defaultProps = {
  layout: {},
  subPlots: false,
  titleX: 0.5,
  titleY: 1,
  size: 0.8,
}

export default CustomPlot
