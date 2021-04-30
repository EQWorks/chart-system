import React from 'react'
import SingleBar from '../src/components/d3/single-bar'
import { geoCohortData } from './data/atom/geo-cohort'
import { ParentSize } from '@visx/responsive'
export default {
  title: 'D3/bar',
}

const [IDdata] = geoCohortData.aggregated.GeoCohortListID
console.log(IDdata)

const barConfig = {
  color: '#0075FF',
  backgroundColor: '#cdcdcd',
  dataKey: {
    x1: 'Imps',
    x2: 'Bids',
  },
}

export const Default = () => {
  const [width, setWidth] = React.useState(500)
  // React.useEffect(() => {
  //   const interval = setInterval(() => setWidth(Math.random() * 200 + 300), 2000);
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  return <div style={{ width: width, height: 200, border: '1px solid black' }}>
    <ParentSize>
      {parent => (
        <SingleBar data={IDdata} width={width} height={parent.height} config={barConfig} />
      )}
    </ParentSize>
  </div>
}
//win rate = imps/bids
//CTR = clicks/impressions
