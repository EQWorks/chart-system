import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const Gauge = ({ data, width, height, config }) => {

  const { dataKey, color, backgroundColor } = config

  const value = data[dataKey.x1] / data[dataKey.x2]
  const remainder = 1.0 - value
  const colors = [color, backgroundColor]
  const svgRef = useRef(null)

  useEffect(() => {
    svgRef.current && d3.select(svgRef.current)
      .selectAll('.arcs')
      .data(arcsData)
      .attr('d', arcPath)
      .attr('fill', (_, i) => colors[i])
      .transition()
      .duration(1000)
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
  }, [data])

  // when a > b
  // sort = b - a
  // flipped = false

  //when a < b
  //sort = a - b
  //flipped = false

  const isAscending = value > remainder

  const pieSize = width > height ? height / 2 : width / 2

  const lineThickness = pieSize * 0.2

  const arcsGenerator = d3.pie().sortValues(function (a, b) { return isAscending ? b - a : a - b })

  const arcsData = arcsGenerator([value, remainder])

  const arcPath = d3.arc().innerRadius(pieSize - lineThickness).outerRadius(pieSize).cornerRadius(lineThickness)

  const [backgroundPath] = d3.pie()([1.0])

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
        }}>{`${value.toFixed(4) * 100}%`}</text>
      </g>
    </svg >
  )
}

Gauge.propTypes = {
  config: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    dataKey: PropTypes.shape({
      x1: PropTypes.string,
      x2: PropTypes.string,
    }),
  }).isRequired,
  data: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

Gauge.defaultProps = {
  color: '#0075FF',
  backgroundColor: '#cdcdcd',
}


export default Gauge
