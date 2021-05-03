import React from 'react'
import Cluster from '../src/components/d3/cluster'
import { geoCohortData } from './data/atom/geo-cohort'
export default {
  title: 'D3/Cluster',
  component: Cluster,
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

export const Default = (args) => {
  const config = {
    color: args.color,
    backgroundColor: args.backgroundColor,
    dataKey: {
      x1: args.valueKey,
      x2: args.remainderKey,
    },
  }

  return <Cluster {...args} config={config} />
}
