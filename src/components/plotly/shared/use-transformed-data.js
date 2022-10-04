import * as d3 from 'd3'
import { useMemo } from 'react'
import { plotlyInterfaces } from './constants'

import { getText, getObjectByType } from '../shared/utils'

const useTransformedData = ({
  type, 
  data,
  groupByValue,
  extra = {},
  variant,
  formatData,
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
            name: k,
            [domain.output]: data.map(d => i === 1 ? d[k] : -Math.abs(d[k])),
            [range.output]: data.map(d => d[args[range.input][0]]),
            orientation,
            text: textArray,
            textposition: textPosition,
            hoverinfo: hoverInfo,
            hovertext: hoverText,
            ...extra,
          }
        )
      })
    } 

    if (groupByValue) {
      return data.map((d, i) => {
        const _d = { ...d }
        const name = _d[args[domain.input]]
        delete _d[args[domain.input]]
        const keys = Object.keys(_d)

        return {
          name,
          hoverinfo: hoverInfo,
          hovertext: hoverText,
          ...getObjectByType(data, type, domain, range, args, _d, formatData[keys[i]], true),
          ...extra,
        }
      })
    }

    return args[range.input].map(k => (
      {
        name: k,
        hoverinfo: hoverInfo,
        hovertext: hoverText,
        ...getObjectByType(data, type, domain, range, args, k, formatData[k]),
        ...extra,
      }
    ))
  }, [args, data, type, domain, range, extra, groupByValue, variant, formatData, hoverInfo, hoverText])
}

export default useTransformedData
