import React from 'react'
import PyramidBar from '../../src/components/plotly/pyramid-bar'

import mockData from '../data/plotly/mock-data-pyramid-bar'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/pyramid-bar',
}

/** -- props (PyramidBar):
 * [x] - array of numbers, defines the range value of 'y' data to be displayed in the chart. (isRequired)
 * [y] - array of string, defines the selected values from the data source to be displayed in the chart. (isRequired)
 * [showTicks] - bool, control ticks display in the chart, default = true
 * [showAxisTitles] - bool, control axisTitles display in the chart, default = true
 * [showPercentage] - bool, control value display format in the chart, default = false
 * [axisLabel] - array of string, defines the chart axis label/title to be displayed, [xAxis, yAxis], default = ['count']
 * [textPosition] - string, defines the text position inside each bar graph, default = 'outside'. only ['inside', 'outside', 'auto', 'none']
*/

const Template = (args) =>
  <ResponsiveChartWrapper>
    <PyramidBar
      data={mockData}
      x={[1000, 700, 300]}
      y={['man', 'woman']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})

export const Percentage = Template.bind({})
Percentage.args = { showPercentage: true }

