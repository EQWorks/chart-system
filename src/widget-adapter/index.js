import React, { createElement, useMemo } from 'react'
import PropTypes from 'prop-types'
import { pick } from 'lodash'

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

const WidgetAdapter = ({ rows, columns, config: { type, options } }) => {

  const adaptedData = useMemo(() => {
    if (type === 'bar') {
      return rows.slice(0, 8).map(row => pick(row, options.keys.concat([options.groupBy])))
    }
    else if (type === 'line') {
      return rows.slice(0, 8).map(row => pick(row,
        options.indexByValue ?
          options.y.concat([options.x])
          :
          options.keys,
      ))
    }
    else if (type === 'pie') {
      return rows.slice(0, 8)
    }
    else if (type === 'scatter') {
      return rows.slice(0, 8)
    }
  }, [options, rows, type])

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
        }
      }
    }
    else if (type === 'line') {
      return {
        // title={title}
        data: adaptedData,
        ...options.indexBy && { indexBy: options.indexBy },
        ...options.indexByValue &&
        {
          yKeys: options.y,
          xKeys: options.x,
        },
        xScale: { type: 'point' },
        indexByValue: options.indexByValue,
        axisBottomLegendLabel: 'axisBottomLegend',
        axisLeftLegendLabel: 'axisLeftLegend',
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

  React.useEffect(() => {
    console.dir(adaptedConfig)
  }, [adaptedConfig])

  return createElement(charts[type], { ...adaptedConfig })
}

WidgetAdapter.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  config: PropTypes.object,
}
WidgetAdapter.default = {
  columns: [],
  rows: [],
  config: {}
}

export default WidgetAdapter
