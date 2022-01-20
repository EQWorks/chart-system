import { setup, styled } from 'goober'
import Plotly from 'plotly.js-basic-dist-min'
import PropTypes from 'prop-types'
import React, { forwardRef, useMemo } from 'react'
import createPlotlyComponent from 'react-plotly.js/factory'
import { useResizeDetector } from 'react-resize-detector'

const Plot = createPlotlyComponent(Plotly)

setup(React.createElement)
const Wrapper = styled('div', forwardRef)`
  height: 100%;
  width: 100%;
`

const SubPlotsWrapper = styled('div')(({ columns, rows }) => ({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  gridTemplateRows: `repeat(${rows}, 1fr)`,
}))

const SubPlotInnerWrapper = styled('div')`
  position: relative;
  overflow: hidden;
`

const SizeablePlotWrapper = styled('div')(({ size }) => ({
  width: '100%',
  height: '100%',
  padding: `${100 - (MIN_SIZE + size * (MAX_SIZE - MIN_SIZE))}%`,
}))

const MIN_SIZE = 60
const MAX_SIZE = 100

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

  const renderPlot = (props = {}) => {
    const { data, layout, ...rest } = props
    return (
      <Plot
        data={data}
        layout={{
          autosize: true,
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          modebar: {
            bgcolor: 'transparent',
            color: 'black',
            activecolor: 'black',
          },
          ...layout,
        }}
        {...rest}
      />
    )
  }

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
    ? <SubPlotsWrapper columns={subPlotColumns} rows={subPlotRows}>
      {
        transformedData.map((d, i) => (
          <SubPlotInnerWrapper key={i} >
            {renderTitle(d.name)}
            <SizeablePlotWrapper size={size}>
              {renderPlot({
                data: [d],
                style: { width: '100%', height: '100%' },
                layout: {
                  showlegend: false,
                  margin: { b: 0, t: 0, l: 0, r: 0 },
                },
                ...props,
              })
              }
            </SizeablePlotWrapper>
          </SubPlotInnerWrapper>
        ))
      }
    </SubPlotsWrapper >
    : <Wrapper ref={ref} >
      {renderPlot({
        data: transformedData,
        layout: {
          width,
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            xanchor: 'right',
            y: 1,
            x: 1,
          },
        },
        style: {
          height: 'inherit',
        },
        ...props,
      })}
    </Wrapper>
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
