import React from 'react'
import { storiesOf } from '@storybook/react'

import PieChart from '../../src/components/pie-chart'
import pieChartData from '../data/others/pie-chart-data'
import ResponsiveChartWrapper from './responsive-chart-wrapper'


const title = 'My Title'

storiesOf('Nivo/Tooltip', module)
  .add('Tooltip Format', () => (
    <ResponsiveChartWrapper>
      <PieChart title={title} data={pieChartData} isDonut={false} tooltipFormat={v => `$${v}`} />
    </ResponsiveChartWrapper>
  ))
  .add('Tooltip - disable', () => (
    <ResponsiveChartWrapper>
      <PieChart
        title={ title }
        data={ pieChartData }
        isDonut={ false }
        isInteractive={false} />
    </ResponsiveChartWrapper>
  ))
  .add('Tooltip - disable Tooltip Title', () => (
    <ResponsiveChartWrapper>
      <PieChart
        title={ title }
        data={ pieChartData }
        isDonut={ false }
        disableTooltipTitle={ true } />
    </ResponsiveChartWrapper>
  ))
