import { createElement, useMemo } from 'react'
import PropTypes from 'prop-types'

import BarChart from '../components/bar-chart/'
import PieChart from '../components/pie-chart/'
import LineChart from '../components/line-chart/'
import ScatterChart from '../components/scatter-chart'

const charts = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  scatter: ScatterChart,
}

const WidgetAdapter = ({ rows, config: { type, options } }) => {

  const shuffledRows = useMemo(() => rows.sort(() => Math.random() - Math.random()), [rows])

  const adaptedData = useMemo(() => {
    if (type === 'bar' || type === 'pie' || type === 'scatter') {
      return shuffledRows.slice(0, 15)
    }
    else if (type === 'line') {
      return rows.slice(0, 15)
    }
    throw new Error
  }, [rows, shuffledRows, type])

  const adaptedConfig = useMemo(() => {
    if (type === 'bar') {
      return {
        data: adaptedData,
        groupMode: options.stack ? 'stacked' : 'grouped',
        ...options.indexBy && { indexBy: options.indexBy },
        ...options.group ?
          {
            groupByKey: options.groupBy,
            valueKey: options.keys[0],
          }
          :
          {
            keys: options.keys,
          },
        // axisBottomLegendLabel: ???,
        ...options.group && options.keys[0] && {
          axisLeftLegendLabel: options.keys[0],
        },
      }
    }
    else if (type === 'line') {
      return {
        // title={title}
        data: adaptedData,
        ...options.indexByValue &&
        {
          indexBy: options.indexBy,
        },
        yKeys: options.y,
        xKey: options.x,
        xScale: { type: 'point' },
        indexByValue: options.indexByValue,
        axisBottomLegendLabel: options.x,
        axisLeftLegendLabel: options.y.join(', '),
      }
    }
    else if (type === 'pie') {
      return {
        //   title:title ,
        data: adaptedData,
        dataKey: options.keys[0], // TODO support multi..?
        indexBy: options.indexBy,
        isDonut: options.donut,
      }
    }
    else if (type === 'scatter') {
      return {
        //   title:title ,
        data: adaptedData,
        xKey: options.x,
        yKeys: options.y,
        indexBy: options.indexBy,
      }
    }
  }, [adaptedData, options, type])

  return createElement(charts[type], { ...adaptedConfig })
}

WidgetAdapter.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  config: PropTypes.object,
}
WidgetAdapter.default = {
  rows: [],
  columns: [],
  config: {},
}

export default WidgetAdapter
