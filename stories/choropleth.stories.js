import React, { useEffect, useState } from 'react'
import Choropleth from '../src/components/d3/choropleth'
import '../src/components/d3/choropleth.css'
export default {
  title: 'D3/Choropleth',
  component: Choropleth,
  args: {
    width: window.innerWidth,
    height: window.innerHeight,
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
    const decay = Math.random() * 0.05

    dateRange.forEach((n, i) => {

      arr.push({
        fsa: properties.id,
        date: `2021-07-${n}`,
        value: Math.max(0.1, startVal - (decay * i))
      })

    })
  })

  return arr
}

const URL = 'https://gist.githubusercontent.com/DoParkEQ/0f438074b19eea9c4c81b907065100fd/raw/120edab420fbc8b557d69335ac4c59dfc67fe828/gta.geojson'

export const Default = (args) => {
  const [counter, setCounter] = useState(1)
  const [currentDate, setCurrentDate] = useState('2021-07-01')
  const [threshold, setThreshold] = useState(0.0);
  const [mapData, setMapData] = useState(null)
  const [timeData, setTimeData] = useState(null)
  const [fastForward, setFastForward] = useState(false)
  useEffect(() => {
    if (fastForward) {
      if (counter < 16) {
        const interval = setInterval(() => {
          setCounter(prev => prev + 1)
          setCurrentDate(prev => {
            const str = counter > 9 ? counter : `0${counter}`
            return `2021-07-${str}`
          })
        }, 500)
        return () => clearInterval(interval)
      }
      else {
        setFastForward(false)
        setCounter(1)
      }
    }
  })

  console.log(counter, currentDate)

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
      <div className='controls'>
        <div>
          <label for='date'>Date</label>
          <input type='range' id='date' min='1' max='15' step='1' onChange={(e) => setCurrentDate(`2021-07-${e.target.value > 9 ? e.target.value : '0' + e.target.value}`)}></input>
          <label for='date'>{currentDate}</label>
        </div>
        <div>
          <label for='date'>Threshold</label>
          <input type='range' id='threshold' min='0' max='1' step='0.01' onChange={(e) => setThreshold(e.target.value)}></input>
          <label for='date'>{threshold}</label>
        </div>
        <div>
          <button onClick={() => setFastForward(!fastForward)}>{fastForward ? '🛑' : '⏩'}</button>
        </div>
      </div>
      <Choropleth width={args.width} height={args.height} threshold={threshold} currentDate={currentDate} data={
        {
          polygon: mapData,
          time: timeData,
        }} />
    </div>
  ) : <div></div>

}
