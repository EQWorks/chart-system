import PropTypes from 'prop-types'
import React, { useRef, useEffect, useMemo } from 'react'
import * as d3 from 'd3'

const GaugeArc = ({ data, width, height, config }) => {

  const { color, backgroundColor, dataKey, transition } = config

  const value = data[dataKey.x2] ? data[dataKey.x1] / data[dataKey.x2] * 100 : 0

  const remainder = 100 - value
  const colors = [color, backgroundColor]
  const svgRef = useRef(null)

  const isAscending = value > remainder

  const pieSize = width > height ? height / 2 : width / 2

  const lineThickness = pieSize * 0.2

  const arcsGenerator = d3.pie().sortValues(function (a, b) { return isAscending ? b - a : a - b })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const arcsData = useMemo(() => arcsGenerator([value, remainder]), [value, remainder])

  const arcPath = d3.arc().innerRadius(pieSize - lineThickness).outerRadius(pieSize).cornerRadius(lineThickness)

  const [backgroundPath] = d3.pie()([1.0])

  useEffect(() => {
    if (svgRef.current !== null) {
      const svg = d3.select(svgRef.current)

      const gauge = svg
        .selectAll('.arcs')
        .data(arcsData)
        .attr('d', arcPath)
        .attr('fill', (_, i) => colors[i])

      if (transition.animation) {
        gauge
          .transition()
          .duration(transition.duration)
          .attrTween('d', function (d) {
            if (d.index === 1) {
              return //deactivate tweening for the remainder value
            }
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
            return function (t) {

              d.endAngle = i(t)
              return arcPath(d)
            }
          })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgRef.current, arcsData])

  return (
    <svg preserveAspectRatio="xMidYMid meet" ref={svgRef} width={width} height={height}>
      <g transform={`translate(${width / 2} ${height / 2})`}>
        <path id="background" d={arcPath(backgroundPath)} fill={backgroundColor} />
        {arcsData.map((d, i) => <path className="arcs" key={i} />)}
        <text style={{
          textAnchor: 'middle',
          dominantBaseline: 'middle',
          fontFamily: 'Open Sans',
          fontSize: '24px',
          fontWeight: 700,
        }}>{`${value.toFixed(2)}%`}</text>
      </g>
    </svg >
  )
}

GaugeArc.propTypes = {
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  config: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    dataKey: PropTypes.shape({
      x1: PropTypes.string,
      x2: PropTypes.string,
    }),
    transition: PropTypes.shape({
      animation: PropTypes.any,
      duration: PropTypes.any,
    }),
  }).isRequired,
  data: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

GaugeArc.defaultProps = {
  color: '#0075FF',
  backgroundColor: '#cdcdcd',
  transition: {
    animation: false,
    duration: 0,
  },
}

export default React.memo(GaugeArc)
