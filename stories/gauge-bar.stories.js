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
    startRange: 0,
    endRange: 5,
    dynamicRange: true,
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
    startRange: {
      control: {
        type: 'number',
      }
    },
    endRange: {
      control: {
        type: 'number',
      }
    },
    dynamicRange: {
      control: {
        type: 'boolean',
        defaultValue: true,
      }
    },
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
    axis: {
      range: [args.startRange, args.endRange],
      dynamicRange: args.dynamicRange,
    }
  }
  return <GaugeBar {...args} config={config} />
}
//win rate = imps/bids
//CTR = clicks/impressions
