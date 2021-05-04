import React from 'react'
import Cluster from '../src/components/d3/cluster'
import { geoCohortData } from './data/atom/geo-cohort'
export default {
  title: 'D3/Cluster',
  component: Cluster,
  args: {
    width: 500,
    height: 500,
    data: geoCohortData.aggregated.GeoCohortItem,
    color: ['#0075FF', '#FAF', '#AA1'],
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
        type: 'select',
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
    dataKey: {
      nodes: 'GeoCohortItem',
      groups: 'GeoCohortListID',
    },
  }

  return <Cluster {...args} config={config} />
}
