import React from 'react'
import Gauge from '../src/components/d3/gauge'
import { geoCohortData } from './data/atom/geo-cohort'
export default {
  title: 'D3/gauge',
}

const [IDdata] = geoCohortData.aggregated.GeoCohortListID
const barConfig = {
  color: '#0075FF',
  dataKey: {
    x: ['Imps', 'Bids'],
    //y: 'Age',
  },
}

export const Default = () => <Gauge data={IDdata} width={500} height={500} config={barConfig} />

//win rate = imps/bids
//CTR = clicks/impressions
