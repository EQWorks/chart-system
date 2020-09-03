import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import PieChart from '../src/components/pie-chart'
import pieChartData from './data/pie-chart-data'
import barChartData from './data/bar-chart-data'
import lineChartData from './data/line-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Pie Chart', module)
  .add('Basic', () => (
    <ResponsiveChartWrapper>
      <PieChart title={ title } data={ pieChartData } isDonut={ false } />
    </ResponsiveChartWrapper>
  ))
  .add('Tooltip Format', () => (
    <ResponsiveChartWrapper>
      <PieChart title={ title } data={ pieChartData } isDonut={ false } tooltipFormat={ v => `$${v}` } />
    </ResponsiveChartWrapper>
  ))
  .add('Dynamic Data - tooltip update', () => {
    const [data, setData] = useState(pieChartData)
    return (
      <ResponsiveChartWrapper>
        <button
          onClick={ () => setData([
            { address_city: 'Sauga', awesomeness: 800 },
            { address_city: 'T-Dot', awesomeness: 1000 },
            { address_city: 'Markham', awesomeness: 1500 }
          ]) }
        >Change Data</button>
        <PieChart title={ title } data={ data } isDonut={ false } />
      </ResponsiveChartWrapper>
    )
  })
  .add('Donut', () => (
    <ResponsiveChartWrapper>
      <PieChart title={ title } data={ pieChartData } isDonut={ true } />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Pie Chart with Slice Labels Disabled', () => (
    <ResponsiveChartWrapper>
      <PieChart title={ title } data={ pieChartData } isDonut={ false } enableSlicesLabels={ false } />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Pie Chart with Slice Labels Disabled at Custom Value', () => (
    <ResponsiveChartWrapper>
      <PieChart title={ title } data={ pieChartData } isDonut={ false } slicesLabelsSkipAngle={ 200 } />
    </ResponsiveChartWrapper>
  ))
  .add('Widget Pie Chart with custom bottom legend label numbers', () => (
    <ResponsiveChartWrapper>
      <PieChart
        title={ title }
        data={ pieChartData }
        isDonut={ false }
        maxRowLegendItems={ 4 }
      />
    </ResponsiveChartWrapper>
  ))
  .add('Visit Data', () => (
    <ResponsiveChartWrapper>
      <PieChart title={ 'Visits' } data={ barChartData } isDonut={ false } />
    </ResponsiveChartWrapper>
  ))
  .add('Vehicle Data', () => (
    <ResponsiveChartWrapper>
      <PieChart title={ 'Vehicles by Country' } data={ lineChartData } dataKey='amount' isDonut={ false } />
    </ResponsiveChartWrapper>
  ))
