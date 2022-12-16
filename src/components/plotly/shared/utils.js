import * as d3 from 'd3'

const getTextInfo = ({ showPercentage, showLabelName }) => {
  if (showPercentage) {
    return showLabelName ? 'label+percent' : 'percent'
  }
  return 'none'
}

const getAxisTitle = (orientation, position, x, y) => {
  return {
    text: orientation === position ? x : (y?.length === 1 && y[0]),
    standoff: 20,
  }
}
  
const getMaxRange = (data, stacked, graphType = 'bar') => {
  let xAxisValues

  if (graphType === 'bar') xAxisValues = data.map(v => Math.max(...v.x))
  if (graphType === 'pyramid') {
    xAxisValues = data.map(v => {
      const values = v.x.map(num => Math.abs(num))
      return Math.max(...values)
    })
  }

  const roundUpValue = Math.ceil(stacked ? xAxisValues.reduce((a, b) => a + b, 0) : Math.max(...xAxisValues))
  const arrayOfZero = [...Array(roundUpValue.toString().length - 1).fill('0')]
  
  let valueUnit = '1'
  arrayOfZero.forEach(v => valueUnit = valueUnit + v)

  if (graphType === 'bar') {
    const maxRange = (Math.ceil(roundUpValue / valueUnit) * valueUnit) * 1.1
    return Number((stacked ? (roundUpValue * 1.15) : maxRange).toFixed(0))
  }
  if (graphType === 'pyramid') {
    const maxRange = (Math.ceil(roundUpValue / valueUnit) * valueUnit)
    return maxRange
  }
}

const getSum = (keys, data) => {
  let total = 0
  keys.forEach(k => {
    const sum = data.map(d => d[k]).reduce((acc, val) => acc + val, 0)
    total += sum
  })

  return total
}

const getText = (value, formatting) => {
  if (formatting && typeof formatting === 'function') {
    return formatting(value)
  }
  return Number(value).toFixed(value % 1 && 2)
}

const getObjectByType = ( 
  data, 
  type, 
  domain, 
  range, 
  args, 
  key, 
  format, 
  tickSuffix, 
  tickPrefix, 
  hoverText, 
  grouped = false, 
) => {
  let typeConfig = {}
  const _tickPrefix = tickPrefix || ''
  const _tickSuffix = tickSuffix || ''

  if (grouped) {
    const _getText = Object.values(key).map(v => {
      const formattedText = getText(v, format && format)
      return `${_tickPrefix}${isNaN(formattedText) ? formattedText : d3.format('~s')(formattedText)}${_tickSuffix}`
    })

    if (type === 'bar') {
      typeConfig = {
        [domain.output]: args?.orientation === 'h' ? Object.values(key) : Object.keys(key),
        [range.output]: args?.orientation === 'h' ? Object.keys(key) : Object.values(key),
        orientation: args.orientation,
        text: _getText,
        hovertext: hoverText || _getText,
        textposition: args?.orientation === 'h' ? args.textPosition : 'none',
      }
    } else {
      typeConfig = {
        [domain.output]: Object.keys(key),
        [range.output]: Object.values(key),
        text: _getText,
        hovertext: hoverText || _getText,
      }
    }
  } else {
    const _getText = data.map(d => {
      const _getText = getText(d[key], format && format)
      return `${_tickPrefix}${isNaN(_getText) ? _getText : d3.format('~s')(_getText)}${_tickSuffix}`
    })

    if (type === 'bar') {
      typeConfig = {
        [domain.output]: args?.orientation === 'h' ? data.map(d => d[key]) : data.map(d => d[args[domain.input]]), 
        [range.output]: args?.orientation === 'h' ? data.map(d => d[args[domain.input]]) : data.map(d => d[key]), 
        orientation: args.orientation,
        text: _getText,
        hovertext: hoverText || _getText,
        textposition: args?.orientation === 'h' ? args.textPosition : 'none',
      }
    } else {
      typeConfig = {
        [domain.output]: data.map(d => d[args[domain.input]]), 
        [range.output]: data.map(d => d[key]), 
        text: _getText,
        hovertext: hoverText || _getText,
      }
    }
  }

  return typeConfig
}

export { getTextInfo, getAxisTitle, getMaxRange, getSum, getText, getObjectByType }
