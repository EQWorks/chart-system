import { useMemo } from 'react'
import * as d3 from 'd3'
import { plotlyInterfaces } from './constants'


const getText = (value, formatting) => {
  if (formatting && typeof formatting === 'function') {
    return formatting(value)
  }
  return value
}

const getObjectByType = ( data, type, domain, range, args, key, format, grouped = false ) => {
  let typeConfig = {}

  if (grouped) {
    if (type === 'bar') {
      typeConfig = {
        [domain.output]: args?.orientation === 'h' ? Object.values(key) : Object.keys(key),
        [range.output]: args?.orientation === 'h' ? Object.keys(key) : Object.values(key),
        orientation: args.orientation,
        text: Object.values(key).map(v => {
          const _getText = getText(v, format && format)
          return isNaN(_getText) ? _getText : d3.format('~s')(_getText)
        }),
        textposition: args?.orientation === 'h' ? args.textPosition : 'none',
      }
    } else {
      typeConfig = {
        [domain.output]: Object.keys(key),
        [range.output]: Object.values(key),
        text: Object.values(key).map(v => getText(v, format && format)),
      }
    }
  } else {
    if (type === 'bar') {
      typeConfig = {
        [domain.output]: args?.orientation === 'h' ? data.map(d => d[key]) : data.map(d => d[args[domain.input]]), 
        [range.output]: args?.orientation === 'h' ? data.map(d => d[args[domain.input]]) : data.map(d => d[key]), 
        orientation: args.orientation,
        text: data.map(d => {
          const _getText = getText(d[key], format && format)
          return isNaN(_getText) ? _getText : d3.format('~s')(_getText)
        }),
        textposition: args?.orientation === 'h' ? args.textPosition : 'none',
      }
    } else {
      typeConfig = {
        [domain.output]: data.map(d => d[args[domain.input]]), 
        [range.output]: data.map(d => d[key]), 
        text: data.map(d => getText(d[key], format && format)),
      }
    }
  }

  return typeConfig
}

const useTransformedData = ({
  type, 
  data,
  groupByValue,
  extra = {},
  variant,
  formatData,
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
          ...getObjectByType(data, type, domain, range, args, _d, formatData[keys[i]], true),
          ...extra,
        }
      })
    }

    return args[range.input].map(k => (
      {
        name: k,
        ...getObjectByType(data, type, domain, range, args, k, formatData[k]),
        ...extra,
      }
    ))
  }, [args, data, type, domain, range, extra, groupByValue, variant, formatData])
}

export default useTransformedData
