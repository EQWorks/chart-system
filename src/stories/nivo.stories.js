import React from 'react'
import PieChart from '../components/pie-chart'
import BarChart from '../components/bar-chart'
import ScatterChart from '../components/scatter-chart/index'
import pieChartData from '../shared/constants/pie-chart-data'
import barChartData from '../shared/constants/bar-chart-data'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import { withKnobs, radios, boolean, number } from '@storybook/addon-knobs'


const smallTab = 'Small'
const mediumTab = 'Medium'
const largeTab = 'Large'

export default {
  title: 'Nivo',
  decorators: [withKnobs]
}

const Row = styled.div`
  box-sizing: border-box;
`

export const PieCharts = () => {
  return (
    <Row>
      <h4>Pie Chart Example</h4>
      <div><p><strong>Small</strong></p></div>
      <PieChart data={pieChartData} width={300}></PieChart>
      <div><p><strong>Medium</strong></p></div>
      <PieChart data={pieChartData} width={400} height={300}></PieChart>
    </Row>
  )
}


export const BarCharts = () => {
  const barChartGroupModeOptions = {
    Stacked: 'stacked',
    Grouped: 'grouped'
  }

  const barChartLayoutOptions = {
    Horizontal: 'horizontal',
    Vertical: 'vertical'
  }

  const smallBarChartData = barChartData.slice(0, 2)
  const mediumBarChartData = barChartData.slice(0, 3)

  const axisBottomTickRotationOptions = {
    range: true,
    min: -90,
    max: 90,
    step: 1,
  }

  const axisLeftTickRotationOptions = {
    range: true,
    min: -90,
    max: 90,
    step: 1,
  }

  const innerPaddingOptions = {
    range: true,
    min: 0,
    max: 10,
    step: 1,
  }

  const barChartGroupModeDefaultValue = barChartGroupModeOptions.Grouped
  const barChartLayoutDefaultValue = barChartLayoutOptions.Vertical
  const barChartinnerPaddingDefaultValue = innerPaddingOptions.min
  const axisBottomTickRotationDefaultValue = 0
  const axisLeftTickRotationDefaultValue = 0
  const barChartReverseDefaultValue = false

  return (
    <Row>
      <h4>Bar Chart Example</h4>
      <BarChart
        headingTitle="Small"
        data={smallBarChartData}
        wrapperWidth={320}
        wrapperHeight={320}
        barChartWidth={288}
        barChartHeight={288}
        innerPadding={number('Bar Chart Small Inner Padding', barChartinnerPaddingDefaultValue, innerPaddingOptions, smallTab)}
        axisBottomTickRotation={number('Bar Chart Small Axis Bottom Rotation', axisBottomTickRotationDefaultValue, axisBottomTickRotationOptions, smallTab)}
        axisLeftTickRotation={number('Bar Chart Small Axis Left Rotation', axisLeftTickRotationDefaultValue, axisLeftTickRotationOptions, smallTab)}
        reverse={boolean('Bar Chart Small Is Reverse?', barChartReverseDefaultValue, smallTab)}
        groupMode={radios('Bar Chart Small Group Mode', barChartGroupModeOptions, barChartGroupModeDefaultValue, smallTab)}
        layout={radios('Bar Chart Small Layout', barChartLayoutOptions, barChartLayoutDefaultValue, smallTab)}
      ></BarChart>
      <BarChart
        headingTitle="Medium"
        data={mediumBarChartData}
        wrapperWidth={427}
        wrapperHeight={320}
        barChartWidth={392}
        barChartHeight={288}
        innerPadding={number('Bar Chart Medium Inner Padding', barChartinnerPaddingDefaultValue, innerPaddingOptions, mediumTab)}
        axisBottomTickRotation={number('Bar Chart Medium Axis Bottom Rotation', axisBottomTickRotationDefaultValue, axisBottomTickRotationOptions, mediumTab)}
        axisLeftTickRotation={number('Bar Chart Medium Axis Left Rotation', axisLeftTickRotationDefaultValue, axisLeftTickRotationOptions, mediumTab)}
        reverse={boolean('Bar Chart Medium Is Reverse?', barChartReverseDefaultValue, mediumTab)}
        groupMode={radios('Bar Chart Medium Group Mode', barChartGroupModeOptions, barChartGroupModeDefaultValue, mediumTab)}
        layout={radios('Bar Chart Medium Layout', barChartLayoutOptions, barChartLayoutDefaultValue, mediumTab)}
      ></BarChart>
      <BarChart
        headingTitle="Large"
        data={barChartData}
        wrapperWidth={656}
        wrapperHeight={320}
        barChartWidth={624}
        barChartHeight={288}
        innerPadding={number('Bar Chart Large Inner Padding', axisBottomTickRotationDefaultValue, innerPaddingOptions, largeTab)}
        axisBottomTickRotation={number('Bar Chart Large Axis Bottom Rotation', axisBottomTickRotationDefaultValue, axisBottomTickRotationOptions, largeTab)}
        axisLeftTickRotation={number('Bar Chart Large Axis Left Rotation', axisLeftTickRotationDefaultValue, axisLeftTickRotationOptions, largeTab)}
        reverse={boolean('Bar Chart Large Is Reverse?', barChartReverseDefaultValue, largeTab)}
        groupMode={radios('Bar Chart Large Group Mode', barChartGroupModeOptions, barChartGroupModeDefaultValue, largeTab)}
        layout={radios('Bar Chart Large Layout', barChartLayoutOptions, barChartLayoutDefaultValue, largeTab)}
      ></BarChart>
    </Row>
  )
}
storiesOf('ScatterChart', module)
  .add('Small ScatterChart', () => <ScatterChart wrapperWidth={ 320 } wrapperHeight={ 320 } />)
  .add('Small responsive ScatterChart', () => <ScatterChart wrapperWidth={ 400 } wrapperHeight={ 700 } />)
  .add('Medium ScatterChart', () => <ScatterChart wrapperWidth={ 427 } wrapperHeight={ 320 } />)
  .add('Medium responsive ScatterChart', () => <ScatterChart wrapperWidth={ 600 } wrapperHeight={ 300 } />)
  .add('Medium responsive ScatterChart tall container', () => <ScatterChart wrapperWidth={ 450 } wrapperHeight={ 460 } />)
