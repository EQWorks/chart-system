import React from 'react'
import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'

import Tooltip from '../tooltip'

import { isAspectRatio, aspectRatios, getCommonProps, processColors } from '../../shared/utils'
import { chartPropTypes, chartDefaultProps } from '../../shared/constants/chart-props'


const arcLabel = e => (
  <>
    <tspan x="0" y="0">{e.percent}</tspan>
    <tspan x="0" y="15">{e.label} </tspan>
  </>
)

const propTypes = {
  isDonut: PropTypes.bool,
  ...chartPropTypes,
}

const defaultProps = {
  isDonut: false,
  ...chartDefaultProps,
}

// PieChart - creates a pie chart
const PieChart = ({
  isDonut,
  data,
  colors,
  colorType,
  colorParam,
  width,
  height,
  ...nivoProps
}) => {
  const finalColors = colors.length ? colors : processColors(data.length, colorType, colorParam)

  let path
  let arc

  const mouseLeaveHandler = () => {
    return (path.forEach((tag, i) => {
      tag.setAttribute('fill', finalColors[i])
      tag.setAttribute('stroke', finalColors[i])
    }
    ))
  }

  const mouseOverHandler = (_data, event) => {
    arc = event.target
    let arcColor = arc.getAttribute('fill')
    path = Array.from(arc.parentNode.children).filter(tag => tag.tagName === 'path')

    return (path.forEach(tag => {
      return arcColor !== tag.getAttribute('fill')
        ? (tag.setAttribute('stroke', 'lightgray'), tag.setAttribute('fill', 'lightgray'))
        : null
    }))
  }

  function percentData() {
    let sum = 0

    for (let d of data) {
      sum = sum + d.value
    }

    data.forEach(arc => {
      arc.percent = `${(arc.value * 100 / sum).toFixed(2)}%`
    })
    return sum
  }

  percentData()

  return (
    <ResponsivePie
      {...nivoProps}
      data={data}
      colors={finalColors}
      padAngle={0.7}
      cornerRadius={3}
      sortByValue={true}
      enableRadialLabels={false}
      sliceLabel={isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? arcLabel : 'percent'}
      slicesLabelsSkipAngle={isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 20 : 10}
      slicesLabelsTextColor='#fff'
      innerRadius={isDonut ? 0.6 : 0}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltip={({ id, value, percent, color }) => (
        <Tooltip
          label={id}
          color={color}
          display={[
            { label: 'Value', value },
            { label: 'Share', value: percent },
          ]}
        />
      )}
      onMouseEnter={mouseOverHandler}
      onMouseLeave={mouseLeaveHandler}
      {...getCommonProps({
        keys: data.map(o => o.id),
        height,
        width,
        dash: true,
      })}
    >
    </ResponsivePie>
  )
}

PieChart.defaultProps = defaultProps
PieChart.propTypes = propTypes

export default PieChart
