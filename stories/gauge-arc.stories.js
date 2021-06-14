import React from 'react'
import GaugeArc from '../src/components/d3/gauge-arc'
import { geoCohortData } from './data/atom/geo-cohort'

const data = {
  "Actions": 0,
  "Bids": 13841,
  "Clicks": 3,
  "Date": [
    [
      "04-30-2021",
      "04-29-2021"
    ],
    [
      "04-20-2021",
      "04-15-2021",
      "04-14-2021",
      "04-12-2021",
      "04-09-2021"
    ]
  ],
  "GeoCohortItem": [
    [
      "M9N",
      "M9M",
      "M9L",
      "M6S",
      "M6R",
      "M6P",
      "M6N",
      "M6M",
      "M6L",
      "M6K",
      "M6J",
      "M6H",
      "M6G",
      "M6E",
      "M6C",
      "M6B",
      "M6A",
      "M5V",
      "M5T",
      "M5S",
      "M5R",
      "M5P",
      "M5N",
      "M5M",
      "M5J",
      "M5H",
      "M5G",
      "M5E",
      "M5C",
      "M5B",
      "M5A",
      "M4Y",
      "M4X",
      "M4W",
      "M4V",
      "M4T",
      "M4S",
      "M4R",
      "M4P",
      "M4N",
      "M4M",
      "M4L",
      "M4K",
      "M4J",
      "M4H",
      "M4G",
      "M4E",
      "M4C",
      "M4B",
      "M3M",
      "M3H",
      "M3C"
    ],
    [
      "Y1A5T9",
      "X1A3J9",
      "V4A1G7",
      "V1E2M5",
      "T8N7A9",
      "T6L6S9",
      "T5E5N7",
      "T2A7Y3",
      "N7M1A5",
      "M3J2J2",
      "M1K4Z7",
      "L8K4K9",
      "L3V2W3",
      "K7V3Z4",
      "K7C3V5",
      "K2R1E8",
      "K2M2N9",
      "J0T1A0",
      "H7X3P1",
      "H3M2P8",
      "X0E1G4",
      "V3V6H4",
      "T6W1G1",
      "T6K1P5",
      "P3A5Z9",
      "N5Z2C2",
      "L6R1A5",
      "L5B4G9",
      "L1W1P4",
      "J7R6B1",
      "H3W2H3",
      "G1B3Y4",
      "E4P2A2",
      "E4L3H2",
      "T4S2L4",
      "S7J2V3",
      "R3C1V3",
      "M9W6H7",
      "L5G4A7",
      "J8L3R4",
      "H8Y1T7",
      "H3N2N7"
    ]
  ],
  "GeoCohortListID": [
    6,
    1
  ],
  "ImpCost": 0.30712399999999995,
  "Imps": 968,
  "Revenue": 2.6620000000000004
}
export default {
  title: 'D3/GaugeArc',
  component: GaugeArc,
  args: {
    width: 300,
    height: 300,
    data: data,
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
  return <GaugeArc {...args} config={config} />
}

//win rate = imps/bids
//CTR = clicks/impressions
