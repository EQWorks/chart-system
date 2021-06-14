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
    color: '#0075FF',
    currentGroup: [1, 2],
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
    currentGroup: {
      control: {
        type: 'radio',
        options: [1, 2],
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
    // backgroundColor: {
    //   control: {
    //     type: 'color',
    //   }
    // },
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
    currentGroup: args.currentGroup,
    dataKey: {
      node: 'GeoCohortListID',
      radius: args.valueKey,
    },
    clusterLengthMax: 150,
    tooltip: {
      dataKey: 'GeoCohortItem',
      style: {
        position: 'absolute',
        minWidth: 80,
        backgroundColor: '#fff',
        padding: 16,
        border: 'none',
        borderRadius: 4,
        boxShadow: '0 2px 8px 0 rgba(12, 12, 13, 0.15)',
        visibility: 'hidden',
      }
    }
  }

  return <Cluster {...args} config={config} />
}
