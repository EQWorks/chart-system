import React from 'react'
import Line from './line'


const LineChart = ({ data, width, height }) => {
  const nivoLineTitle = 'Title'
  const nivoLineDescription = 'Title description description description description description description description description description description description description description description description description description description description description'

  const hexColorChars = '23456789BDF'

  const getRandomColor =() => (
    `#${Array.from({ length: 6 })
        .map(() => hexColorChars[Math.floor(Math.random() * 11)])
        .join('')
    }`
)

const dataWithColor = data.map(datum => ({
    ...datum,
    color: getRandomColor()
}))

  return (
    <div width={width} height={height}>
      <Line data={dataWithColor} axisBottomLegend='transportation' axisLeftLegend='count' title={nivoLineTitle} description={nivoLineDescription} width={width} height={height} />
    </div>
  )
}

export default LineChart