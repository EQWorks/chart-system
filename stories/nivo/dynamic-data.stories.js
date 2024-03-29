import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import BarChart from '../../src/components/nivo/bar-chart/'
import PieChart from '../../src/components/nivo/pie-chart'
import barChartData from '../data/others/bar-chart-data'
import pieChartData from '../data/others/pie-chart-data'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Nivo/Dynamic Data', module)
  .add('Dynamic Data - legend update', () => {
    const [data, setData] = useState(barChartData)
    return (
      <div>
        <button
          onClick={() => setData([{
            address_city: 'Sauga',
            dopeness: 1000,
            awesomeness: 800,
          },
          {
            address_city: 'T-Dot',
            dopeness: 2000,
            awesomeness: 2100,
          }])}
        >Change Data</button>
        <br />
        <ResponsiveChartWrapper>
          <BarChart
            data={data}
            axisBottomLegendLabel='Address City'
            axisLeftLegendLabel='Visitors'
          />
        </ResponsiveChartWrapper>
      </div>
    )
  })
  .add('Dynamic Data - tooltip update', () => {
    const [data, setData] = useState(pieChartData)
    return (
      <div>
        <button
          onClick={() => setData([
            { address_city: 'Sauga', awesomeness: 800 },
            { address_city: 'T-Dot', awesomeness: 1000 },
            { address_city: 'Markham', awesomeness: 1500 },
          ])}
        >Change Data
        </button>
        <ResponsiveChartWrapper>
          <PieChart title={title} data={data} isDonut={false} />
        </ResponsiveChartWrapper>
      </div>
    )
  })
