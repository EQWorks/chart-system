import React from 'react'
import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'

import Tooltip from '../tooltip'

import designSystemColors from '../../shared/constants/design-system-colors'

import { isAspectRatio, aspectRatios, getCommonProps } from '../../shared/utils'


const arcLabel = e => (
  <>
    <tspan x="0" y="0">{e.percent}</tspan>
    <tspan x="0" y="15">{e.label} </tspan>
  </>
)

const colors = [
  designSystemColors.blue70,
  designSystemColors.yellow70,
  designSystemColors.pink70,
  designSystemColors.purple70,
  designSystemColors.teal70
]

// sets common props for Nivo ResponsivePie component
const setCommonProps = (width, height, data, isDonut) => ({
  colors,
  padAngle: 0.7,
  cornerRadius: 3,
  sortByValue: true,
  enableRadialLabels: false,
  sliceLabel: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? arcLabel : 'percent',
  slicesLabelsSkipAngle: isAspectRatio(width, height, aspectRatios.LANDSCAPE) ? 20 : 10,
  slicesLabelsTextColor: '#fff',
  innerRadius: isDonut ? 0.6 : 0,
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
  ...getCommonProps({
    data,
    height,
    width,
    dash: true,
  })
})


const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isDonut: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
}

const defaultProps = {
  isDonut: false,
  width: 100,
  height: 100,
}

// PieChart - creates a pie chart
const PieChart = ({
  data,
  isDonut,
  height,
  width,
}) => {
  let path
  let arc

  const mouseLeaveHandler = () => {
    return (path.forEach((tag, i) => {
      tag.setAttribute('fill', colors[i])
      tag.setAttribute('stroke', colors[i])
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
      {...setCommonProps(width, height, data, isDonut)}
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
    >
    </ResponsivePie>
  )
}

PieChart.defaultProps = defaultProps
PieChart.propTypes = propTypes

export default PieChart
