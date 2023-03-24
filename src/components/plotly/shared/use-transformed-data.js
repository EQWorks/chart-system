import * as d3 from 'd3'
import { useMemo } from 'react'
import { plotlyInterfaces, PLOTLY_HOVERINFO_PERCENTAGE } from './constants'

import { getText, getObjectByType, getSum, getHoverInfo } from '../shared/utils'

const useTransformedData = ({
  type, 
  data,
  columnNameAliases,
  groupByValue,
  extra = {},
  variant,
  formatData,
  tickSuffix,
  tickPrefix,
  hoverInfo,
  hoverText,
  ...args
}) => {
  const { domain, range } = plotlyInterfaces[type]
  return useMemo(() => {
    if (variant === 'pyramidBar') {
      const { orientation, showPercentage, sum, textPosition } = args

      return args[domain.input].map((k, i) => {
        const textArray = showPercentage ? data.map(d => `${((d[k]*100) / sum).toFixed(2)}%`) : 
          data.map(d => { 
            const _getText = getText(d[k], formatData[k]) 
            return isNaN(_getText) ? _getText : d3.format('~s')(_getText)
          })

        return (
          {
            name: columnNameAliases[k] || k,
            [domain.output]: data.map(d => i === 1 ? d[k] : -Math.abs(d[k])),
            [range.output]: data.map(d => d[args[range.input][0]]),
            orientation,
            text: textArray,
            textposition: textPosition,
            hoverinfo: hoverInfo,
            ...extra,
          }
        )
      })
    } 

    // this is an expensive process for large data sets
    if (groupByValue) {
      return data.map((d, i) => {
        const keys = args.y || args.values
        const _d = {}
        const name = d[args[domain.input]]
        Object.keys(d).forEach(key => {
          if (keys.includes(key)) {
            _d[columnNameAliases[key] || key] = d[key]
          }
        })
        const totalSum = getSum(keys, [d])
        return {
          name: columnNameAliases[name] || name,
          hoverinfo: getHoverInfo({
            cond: Math.round(totalSum) === 100,
            value: PLOTLY_HOVERINFO_PERCENTAGE[type],
            hoverInfo,
          }),
          totalSum,
          ...getObjectByType(data, type, domain, range, args, _d, formatData[keys[i]],tickSuffix,
            tickPrefix, hoverText, true),
          ...extra,
        }
      })
    }

    return args[range.input].map(k => (
      {
        name: columnNameAliases[k] || k,
        hoverinfo: getHoverInfo({
          cond: Math.round(getSum([k], data)) === 100,
          value: PLOTLY_HOVERINFO_PERCENTAGE[type],
          hoverInfo,
        }),
        totalSum: getSum([k], data),
        ...getObjectByType(data, type, domain, range, args, k, formatData[k], tickSuffix, tickPrefix, hoverText),
        ...extra,
      }
    ))
  }, [
    args,
    data,
    columnNameAliases,
    type,
    domain,
    range,
    extra,
    groupByValue,
    variant,
    formatData,
    tickSuffix,
    tickPrefix,
    hoverInfo,
    hoverText,
  ])
}

export default useTransformedData
