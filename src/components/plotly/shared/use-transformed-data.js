import { useMemo } from 'react'
import { plotlyInterfaces } from './constants'


const useTransformedData = ({
  type, 
  data,
  groupByValue,
  extra = {},
  ...args
}) => {
  const { domain, range } = plotlyInterfaces[type]
  return useMemo(() => (
    groupByValue
      ? data.map(d => {
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
      : args[range.input].map(k => (
        {
          name: k,
          [domain.output]: data.map(d => d[args[domain.input]]),
          [range.output]: data.map(d => d[k]),
          ...extra,
        }
      ))
  ), [args, data, domain, range, extra, groupByValue])
}

export default useTransformedData
