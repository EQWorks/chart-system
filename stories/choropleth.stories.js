import React, { useEffect, useState } from 'react'
import Choropleth from '../src/components/d3/choropleth'

export default {
  title: 'D3/Choropleth',
  component: Choropleth,
  args: {
    width: 1000,
    height: 1000,
    color: '#0075FF',
    backgroundColor: '#cdcdcd',
    valueKey: 'Imps',
    remainderKey: 'Bids',
    animation: true,
    duration: 1000,
  },
  argTypes: {
    width: {
      control: {
        type: 'number',
        options: [0, 500],
      },
    },
    height: {
      control: {
        type: 'number',
        options: [0, 500],
      },
    },
    color: {
      control: {
        type: 'color',
      },
    },
    backgroundColor: {
      control: {
        type: 'color',
      },
    },
    valueKey: {
      control: {
        type: 'select',
        options: ['Bids', 'Imps', 'Clicks'],
      },
    },
    remainderKey: {
      control: {
        type: 'select',
        options: ['Bids', 'Imps', 'Clicks'],
      },
    },
    animation: {
      control: {
        type: 'boolean',
        defaultValue: true,
      },
    },
    duration: {
      control: {
        type: 'number',
      },
    },
  },
}

// const date = [{
//   fsa,
//   date,
//   value,
//   },
// }]

const dateRange = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'];

const generateTimeSeries = (d) => {

  const arr = [];

  d.features.forEach(({ properties }) => {
    const startVal = Math.random()
    const decay = Math.random() * 0.5

    dateRange.forEach((n, i) => {

      arr.push({
        fsa: properties.id,
        date: `2021-07-${n}`,
        value: startVal - (decay * i)
      })

    })
  })

  return arr
}

const URL = 'https://gist.githubusercontent.com/DoParkEQ/0f438074b19eea9c4c81b907065100fd/raw/120edab420fbc8b557d69335ac4c59dfc67fe828/gta.geojson'

export const Default = (args) => {

  const [currentDate, setCurrentDate] = useState(null)
  const [mapData, setMapData] = useState(null)
  const [timeData, setTimeData] = useState(null)

  useEffect(() => {
    fetch(URL).then(res => res.json()).then(d => {

      const t = generateTimeSeries(d)
      console.log(t)
      setTimeData(t)
      setMapData(d)

    })
  }, [])


  const config = {
    color: args.color,
    backgroundColor: args.backgroundColor,
    dataKey: {
      x1: args.valueKey,
      x2: args.remainderKey,
    },
    transition: {
      animation: args.animation,
      duration: args.duration,
    }
  }

  return mapData && timeData ? (
    <div>
      <label for='date'>{currentDate}</label>
      <input type='range' id='date'></input>
      <label for='date'>Date</label>
      <button>fast forward</button>
      <button>stop</button>
      <Choropleth width={args.width} height={args.height} data={
        {
          polygon: mapData,
          time: timeData,
        }} />
    </div>
  ) : <div></div>

}
