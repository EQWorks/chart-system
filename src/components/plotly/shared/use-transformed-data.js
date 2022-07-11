import { useMemo } from 'react'
import { plotlyInterfaces } from './constants'


const getObjectByType = ( data, type, domain, range, args, key, grouped = false ) => {
  let typeConfig = {}

  if (grouped) {
    if (type === 'bar') {
      typeConfig = {
        [domain.output]: args?.orientation === 'h' ? Object.values(key) : Object.keys(key),
        [range.output]: args?.orientation === 'h' ? Object.keys(key) : Object.values(key),
        orientation: args.orientation,
        text: args?.orientation === 'h' ? Object.values(key) : Object.keys(key),
        textposition: args?.orientation === 'h' ? args.textPosition : 'none',
      }
    } else {
      typeConfig = {
        [domain.output]: Object.keys(key),
        [range.output]: Object.values(key),
      }
    }
  } else {
    if (type === 'bar') {
      typeConfig = {
        [domain.output]: args?.orientation === 'h' ? data.map(d => d[key]) : data.map(d => d[args[domain.input]]), 
        [range.output]: args?.orientation === 'h' ? data.map(d => d[args[domain.input]]) : data.map(d => d[key]), 
        orientation: args.orientation,
        text: args?.orientation === 'h' ? data.map(d => d[key]) : data.map(d => d[args[domain.input]]),
        textposition: args?.orientation === 'h' ? args.textPosition : 'none',
      }
    } else {
      typeConfig = {
        [domain.output]: data.map(d => d[args[domain.input]]), 
        [range.output]: data.map(d => d[key]), 
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
  ...args
}) => {
  const { domain, range } = plotlyInterfaces[type]

  return useMemo(() => {
    if (variant === 'pyramidBar') {
      const { orientation, showPercentage, sum, textPosition } = args

      return args[range.input].map((k, i) => {
        const text = showPercentage ? data.map(d => `${((d[k]*100) / sum).toFixed(2)}%`) : data.map(d => d[k])
        return (
          {
            name: k,
            [domain.output]: data.map(d => i === 1 ? d[k] : -Math.abs(d[k])),
            [range.output]: data.map(d => Object.values(d)[0]),
            orientation,
            text: text,
            textposition: textPosition,
            ...extra,
          }
        )
      })
    } 

    if (groupByValue) {
      return data.map(d => {
        const _d = { ...d }
        const name = _d[args[domain.input]]
        delete _d[args[domain.input]]
        return {
          name,
          ...getObjectByType(data, type, domain, range, args, _d, true),
          ...extra,
        }
      })
    }

    return args[range.input].map(k => (
      {
        name: k,
        ...getObjectByType(data, type, domain, range, args, k),
        ...extra,
      }
    ))
  }, [args, data, type, domain, range, extra, groupByValue, variant])
}

export default useTransformedData
