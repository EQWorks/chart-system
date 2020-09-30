import React from 'react'
import { storiesOf } from '@storybook/react'

import PieChart from '../src/components/pie-chart'
import pieChartData from './data/pie-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Tooltip', module)
  .add('Tooltip Format', () => (
    <ResponsiveChartWrapper>
      <PieChart title={ title } data={ pieChartData } isDonut={ false } tooltipFormat={ v => `$${v}` } />
    </ResponsiveChartWrapper>
  ))