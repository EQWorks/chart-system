import React, { useEffect, useState } from 'react'
import ChoroplethSVG from '../src/components/d3/choropleth-svg'
import '../src/components/d3/choropleth.css'
import idfaData from './data/others/IDFA/complete'
import * as d3 from 'd3'

export default {
  title: 'D3/ChoroplethSVG',
  component: ChoroplethSVG,
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

const generateDateRange = (start, end) => {
  const arr = []
  for (let i = start; i < end; i++) {
    let char
    if (i < 10) {
      char = '0' + i;
    } else {
      char = `${i}`
    }
    arr.push(char)
  }
  return arr
}

const dateRange = generateDateRange(3, 30);

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
  const [counter, setCounter] = useState(3)
  const [currentDate, setCurrentDate] = useState('2021-05-30')
  const [threshold, setThreshold] = useState({
    range: [0, 1],
    current: 1,
  });
  const [mapData, setMapData] = useState(null)
  const [timeData, setTimeData] = useState(null)
  const [fastForward, setFastForward] = useState(false)

  useEffect(() => {
    if (fastForward) {
      if (counter < 30) {
        const interval = setInterval(() => {
          setCounter(prev => prev + 1)
          setCurrentDate(prev => {
            const str = counter > 9 ? counter : `0${counter}`
            return `2021-05-${str}`
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



  useEffect(() => {
    fetch(URL).then(res => res.json()).then(d => {

      // const t = generateTimeSeries(d)
      // console.log(t)
      // setTimeData(t)
      setTimeData(idfaData)
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
          <input type='range' id='date' min='3' max='30' step='1' onChange={(e) => setCurrentDate(`2021-05-${e.target.value > 9 ? e.target.value : '0' + e.target.value}`)}></input>
          <label for='date'>{currentDate}</label>
        </div>
        <div>
          <label for='threshold'>Threshold</label>
          <input type='range' id='threshold' min={threshold.range[0]} max={threshold.range[1]} step='0.1' onChange={(e) => {
            const val = e.target.value ?? 1
            setThreshold(prev => ({ range: prev.range, current: parseFloat(val) }))
          }
          }></input>
          <label for='threshold'>{threshold.current}</label>
        </div>
        <div>
          <button onClick={() => setFastForward(!fastForward)}>{fastForward ? '🛑' : '⏩'}</button>
        </div>
      </div>
      <ChoroplethSVG
        width={args.width}
        height={args.height}
        config={{
          projection: {
            center: [-79.2, 44],
            scale: 10000,
            translate: [args.width / 2, args.height / 2],
          },
          threshold: {
            status: true,
            key: 'deviceCount',
            value: threshold.current,
          },
          currentTime: {
            key: 'date',
            value: currentDate
          },
          tooltipStyle: {
            width: 180,
            height: 120,
          }
        }}
        data={
          {
            polygon: mapData,
            time: timeData,
          }} />
    </div>
  ) : <div></div>

}
