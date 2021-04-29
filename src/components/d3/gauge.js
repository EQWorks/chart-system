import PropTypes from 'prop-types'
import React, { useRef, useState, useEffect } from 'react'
import * as d3 from 'd3'
import { pie } from 'd3-shape';

const percentage = 0.25;
const rectHeight = 100;
const padding = 50;
const spacing = 10;
const colors = ['blue', 'grey']
function tweenPie(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b);
  return function (t) { return arc(i(t)); };
}


const Gauge = ({ width, height, config }) => {

  const svgRef = useRef(null)
  const [data, setData] = useState([0.30, 0.70])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const value = Math.random();
  //     const remainder = 1 - value;
  //     setData([value, remainder])
  //   }, 1000)
  //   return () => clearInterval(interval);
  // })

  useEffect(() => {
    console.log(arcsData)
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
        var i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {

          d.endAngle = i(t);
          return arcPath(d);
        }
      });
  }, [data])

  // when a > b
  // sort = b - a
  // flipped = false

  //when a < b
  //sort = a - b
  //flipped = false

  const isAscending = data[0] > data[1]

  const arcsData = d3.pie().sortValues(function (a, b) { return isAscending ? b - a : a - b })(data);

  const arcPath = d3.arc().innerRadius(100).outerRadius(150);

  const [background] = d3.pie()([1.0])
  console.log(arcPath(background))
  return (
    <svg ref={svgRef} width={width + padding * 1.5} height={height + padding}>
      <g transform={`translate(${width / 2} ${height / 2})`}>
        <path id="background" d={arcPath(background)} fill='grey' />
        {arcsData.map((d, i) => <path className="arcs" key={i} />)}
      </g>
    </svg >
  )
}


export default Gauge
