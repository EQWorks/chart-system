import React from 'react'
import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'

import Tooltip from '../tooltip'

import { getCommonProps, processColors } from '../../shared/utils'
import { chartPropTypes, chartDefaultProps } from '../../shared/constants/chart-props'
import { DATA_HOVER_OPACITY } from '../../shared/constants/dimensions'

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
    return (path.forEach((tag) => {
      tag.style.opacity = 1
    }))
  }

  const mouseOverHandler = (_data, event) => {
    console.log('event.target: ', event.target)
    arc = event.target
    let arcColor = arc.getAttribute('fill')
    path = Array.from(arc.parentNode.children).filter(tag => tag.tagName === 'path')

    return (path.forEach(tag => {
      return arcColor == tag.getAttribute('fill')
        ? tag.style.opacity = 1
        : tag.style.opacity = DATA_HOVER_OPACITY
    }))
  }

  const percentData = () => {
    let total = data.reduce((sum, dataSet) => sum += dataSet.value, 0)
    data.forEach(arc => {
      arc.percent = `${(arc.value * 100 / total).toFixed(1)}%`
    })
    return total
  }

  percentData()

  return (
    <ResponsivePie
      {...nivoProps}
      data={data}
      colors={finalColors}
      padAngle={0.7}
      cornerRadius={3}
      enableRadialLabels={false}
      fit={true}
      slicesLabelsSkipAngle={ 30 }
      slicesLabelsTextColor='#fff'
      innerRadius={isDonut ? 0.6 : 0}
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
        useAxis: false,
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
