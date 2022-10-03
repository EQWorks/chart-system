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

const getSum = (x, data) => {
  let total = 0
  x.forEach(k => {
    const sum = data.map(d => d[k]).reduce((acc, val) => acc + val, 0)
    total += sum
  })

  return total
}

export { getTextInfo, getAxisTitle, getMaxRange, getSum }
