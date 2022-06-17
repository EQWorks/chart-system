import { useMemo } from 'react'
import { plotlyInterfaces } from './constants'


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
      const { orientation, percentage, sum } = args

      return args[range.input].map((k, i) => {
        const text = percentage ? data.map(d => `${((d[k]*100) / sum).toFixed(2)}%`) : data.map(d => d[k])
        return (
          {
            name: k,
            [domain.output]: data.map(d => i === 1 ? d[k] : -Math.abs(d[k])),
            [range.output]: data.map(d => Object.values(d)[0]),
            orientation,
            text: text,
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
          [domain.output]: Object.keys(_d),
          [range.output]: Object.values(_d),
          ...extra,
        }
      })
    } else {
      return args[range.input].map(k => (
        {
          name: k,
          [domain.output]: data.map(d => d[args[domain.input]]),
          [range.output]: data.map(d => d[k]),
          ...extra,
        }
      ))
    }
  }, [args, data, domain, range, extra, groupByValue, variant])
}

export default useTransformedData
