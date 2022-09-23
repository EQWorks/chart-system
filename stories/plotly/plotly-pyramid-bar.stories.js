import React from 'react'
import PyramidBar from '../../src/components/plotly/pyramid-bar'

import mockData from '../data/plotly/mock-data-pyramid-bar'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/pyramid-bar',
}

/** -- props (PyramidBar):
 * [x] - array of string, defines the selected values from the data source to be displayed in the chart xAxis. (isRequired)
 * [y] - array of string, defines the selected values from the data source to be displayed in the chart yAxis. (isRequired)
 * [showTicks] - bool, control ticks display in the chart, default = true
 * [showAxisTitles] - bool, control axisTitles display in the chart, default = true
 * [showPercentage] - bool, control value display format in the chart, default = false
 * [axisLabel] - array of string, defines the chart axis label/title to be displayed, [xAxis, yAxis], default = ['count']
 * [xAxisTick] - array of numbers, defines the range value of 'x' data to be displayed in the chart.
 * [xAxisLabelLength] - number, defines de number of tick in xAxis. Only works if there is not xAxisTick
 * [textPosition] - string, defines the text position inside each bar graph, default = 'outside'. only ['inside', 'outside', 'auto', 'none']
 * [formatData] - object of func, formats the displayed data value in the chart. key must match string in [x], default = 5
 * [tickSuffix] - array of string, allows to add suffix to the chart axis values, [xAxis, yAxis] 
 * [tickPrefix] - array of string, allows to add prefix to the chart axis values, [xAxis, yAxis]
*/

const Template = (args) =>
  <ResponsiveChartWrapper>
    <PyramidBar
      data={mockData}
      x={['man', 'woman']}
      y={['age']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const Percentage = Template.bind({})
Percentage.args = { showPercentage: true }

export const CustomXaxisTick = Template.bind({})
CustomXaxisTick.args = { xAxisTick: [1000, 600, 300]}
