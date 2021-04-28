import React from 'react'
import SingleBar from '../src/components/visx/single-bar'
import { geoCohortData } from './data/atom/geo-cohort'
export default {
  title: 'D3/bar',
}

const [IDdata] = geoCohortData.aggregated.GeoCohortListID
console.log(IDdata)
const barConfig = {
  color: '#0075FF',
  dataKey: {
    x: ['Imps', 'Bids'],
    //y: 'Age',
  },
}

export const Default = () => <SingleBar data={IDdata} width={500} height={500} config={barConfig} />

//win rate = imps/bids
//CTR = clicks/impressions
