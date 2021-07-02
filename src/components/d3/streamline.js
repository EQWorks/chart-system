import PropTypes from 'prop-types'
import React, { useState } from 'react'
import * as d3 from 'd3'

const Streamline = ({ data, width, height, config }) => {

  const { key, xAxisRange, yAxisRange, style, threshold, screeningMode } = config
  const { color, strokeWidth } = style
  const { max, min, unit } = threshold
  // const [draggedElement, setDraggedElement] = useState({ isDragged: false, target: null, type: null })

  // useEffect(() => {
  //   if (draggedElement.isDragged) {
  //     const { target, type } = draggedElement;
  //     setThresholdLines(prev => ({ ...prev, [type]: getInvertedLine(target.nativeEvent.offsetY) }))
  //   }

  // }, [])

  const xScale = d3.scaleLinear()
    .domain(Array.isArray(xAxisRange) ? xAxisRange : [0, data.length - 1])
    .range([0, width])

  const yScale = d3.scaleLinear()
    .domain(yAxisRange)
    .range([height, 0])

  // const invertedYScale = d3.scaleLinear()
  //   .domain([0, height])
  //   .range([0, height])

  const lineGenerator = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d[key]))
    .curve(d3.curveMonotoneX)

  const path = lineGenerator(data)

  const getLine = (val) => d3.line()([[0, yScale(val)], [width, yScale(val)]])
  // const getInvertedLine = (val) => d3.line()([[0, invertedYScale(val)], [width, invertedYScale(val)]])
  const [thresholdLines, setThresholdLines] = useState(
    {
      min: !isNaN(min) ? getLine(min) : null,
      max: !isNaN(max) ? getLine(max) : null,
    })

  const onDrag = (e, type) => {
    if (screeningMode && (type === 'max' || type === 'min')) {
      setDraggedElement(prev => ({ isDragged: !prev.isDragged, target: e, type: type }))
    }
  }

  // const getNewPosition = (e, type) => {
  //   // console.log("g:", e.nativeEvent.clientX, e.nativeEvent.clientY);
  //   if (draggedElement.isDragged) {
  //     setThresholdLines(prev => ({ ...prev, [type]: getInvertedLine(e.nativeEvent.offsetY) }))
  //     // console.log(e.nativeEvent.offsetY)
  //   }
  // }
  // console.log(threshold, thresholdLines)
  return (
    <div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={`gradient-${key}`} gradientTransform="rotate(90)">
            <stop offset='5%' stopColor={`${color}40`} />
            <stop offset='50%' stopColor={`${color}00`} />
          </linearGradient>
        </defs>
        {thresholdLines.max && <g onClick={(e) => onDrag(e, 'max')}>
          <path id={`max-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={thresholdLines.max} />
          <text dy='-10' style={{
            fontSize: '12px',
            fill: '#ccc',
          }}>
            <textPath xlinkHref={`#max-${key}`}>{`maximum ${max}${unit}`}</textPath>
          </text>
        </g>}
        {thresholdLines.min && <g onMouseDown={(e) => screeningMode && onDrag(e, 'min')}>
          <path id={`min-${key}`} strokeDasharray="10,10" strokeWidth='2' stroke='#ccc' fill='none' strokeWidth='1' d={thresholdLines.min} />
          <text dy='20' style={{
            fontSize: '12px',
            fill: '#ccc',
          }}>
            <textPath xlinkHref={`#min-${key}`}>{`minimum ${min}${unit}`}</textPath>
          </text>
        </g>}
        <path stroke='rbga(255,255,255,0)' fill={`url(#gradient-${key})`} d={`M0,${height} ` + path + ` v${height} L0,${height}`} />
        <path stroke={color} fill='none' strokeWidth={strokeWidth} d={path} />
      </svg>
    </div>
  )
}

Streamline.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
    screeningMode: PropTypes.bool,
    style: PropTypes.shape({
      color: PropTypes.string,
      strokeWidth: PropTypes.number,
    }),
    threshold: PropTypes.shape({
      max: PropTypes.number,
      min: PropTypes.number,
      unit: PropTypes.string,
    }),
    xAxisRange: PropTypes.array,
    yAxisRange: PropTypes.array,
  }),
  data: PropTypes.shape({
    length: PropTypes.number,
  }),
  height: PropTypes.number,
  width: PropTypes.number,
}

export default Streamline
