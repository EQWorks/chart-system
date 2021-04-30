import React from 'react'
import GaugeBar from '../src/components/d3/gauge-bar'
import { geoCohortData } from './data/atom/geo-cohort'
import { ParentSize } from '@visx/responsive'
export default {
  title: 'D3/GaugeBar',
  component: GaugeBar,
  args: {
    width: 300,
    height: 300,
    data: geoCohortData.aggregated.GeoCohortListID[0],
    color: '#0075FF',
    backgroundColor: '#cdcdcd',
    valueKey: 'Imps',
    remainderKey: 'Bids',
  },
  argTypes: {
    width: {
      control: {
        type: 'number',
        options: [0, 500],
      }
    },
    height: {
      control: {
        type: 'number',
        options: [0, 500],
      }
    },
    color: {
      control: {
        type: 'color',
      }
    },
    backgroundColor: {
      control: {
        type: 'color',
      }
    },
    valueKey: {
      control: {
        type: 'select',
        options: ['Bids', 'Imps', 'Clicks'],
      }
    },
    remainderKey: {
      control: {
        type: 'select',
        options: ['Bids', 'Imps', 'Clicks'],
      }
    },
  },
}

const barConfig = {
  color: '#0075FF',
  backgroundColor: '#cdcdcd',
  dataKey: {
    x1: 'Imps',
    x2: 'Clicks',
  },
}

export const Default = (args) => {
  const config = {
    color: args.color,
    backgroundColor: args.backgroundColor,
    dataKey: {
      x1: args.valueKey,
      x2: args.remainderKey,
    },
  }
  return <GaugeBar {...args} config={config} />
}
//win rate = imps/bids
//CTR = clicks/impressions
