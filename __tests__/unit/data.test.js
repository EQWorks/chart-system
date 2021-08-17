import {
  processDataKeys,
  processSeriesDataKeys,
  processPieDataKeys,
  convertDataToNivo,
  convertPieDataToNivo,
  aggregateData,
} from '../../src/components/nivo/shared/utils'
import barChartData from '../../stories/data/others/bar-chart-data'
import lineChartData from '../../stories/data/others/line-chart-data'


describe('Process Data Keys', () => {
  it('should default to first key and ...rest', () => {
    const { finalIndexBy, finalKeys } = processDataKeys({ data: barChartData })
    const keys = Object.keys(barChartData[0])
    expect(finalIndexBy).toEqual(keys[0])
    expect(finalKeys).toEqual(keys.slice(1))
  })
  it('should remove indexBy keys by default', () => {
    const indexBy = 'address_city'
    const { finalIndexBy, finalKeys } = processDataKeys({ indexBy, data: barChartData })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalKeys.includes(indexBy)).toBeFalsy()
  })
  it('should return provided values', () => {
    const indexBy = 'address_city'
    const keys = ['visits', 'repeat_visits']
    const { finalIndexBy, finalKeys } = processDataKeys({ indexBy, keys, data: barChartData })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalKeys).toEqual(keys)
  })
  it('should return keys based on value of groupByKey', () => {
    const indexBy = 'country'
    const groupByKey = 'vehicle'
    const { finalIndexBy, finalKeys } = processDataKeys({ indexBy, groupByKey, data: lineChartData })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalKeys[0]).toEqual(lineChartData[0][groupByKey])
  })
})

describe('Process Series Data Keys', () => {
  it('should default to first 3 keys - indexByValue', () => {
    const indexByValue = true
    const { finalIndexBy, finalXKey, finalYKeys } = processSeriesDataKeys({ data: barChartData, indexByValue })
    const keys = Object.keys(barChartData[0])
    expect(finalIndexBy).toEqual(keys[0])
    expect(finalXKey).toEqual(keys[1])
    expect(finalYKeys).toEqual([keys[2]])
  })
  it('should return provided values - indexByValue', () => {
    const indexByValue = true
    const indexBy = 'address_city'
    const xKey = 'visits'
    const yKeys = ['repeat_visitors']
    const { finalIndexBy, finalXKey, finalYKeys } = processSeriesDataKeys({ data: barChartData, indexByValue, indexBy, xKey, yKeys })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalXKey).toEqual(xKey)
    expect(finalYKeys).toEqual(yKeys)
  })
  it('should return provided values - indexByKey', () => {
    const xKey = 'visits'
    const yKeys = ['repeat_visitors']
    const { finalIndexBy, finalXKey, finalYKeys } = processSeriesDataKeys({ data: barChartData, xKey, yKeys })
    expect(finalIndexBy).toEqual(undefined)
    expect(finalXKey).toEqual(xKey)
    expect(finalYKeys).toEqual(yKeys)
  })
})

describe('Process Pie Data Keys', () => {
  it('should default to first 2 keys', () => {
    const { finalIndexBy, finalDataKey } = processPieDataKeys({ data: barChartData, indexBy: '', dataKey: '' })
    const keys = Object.keys(barChartData[0])
    expect(finalIndexBy).toEqual(keys[0])
    expect(finalDataKey).toEqual(keys[1])
  })
  it('should return provided values', () => {
    const indexBy = 'address_city'
    const dataKey = 'visits'
    const { finalIndexBy, finalDataKey } = processPieDataKeys({ data: barChartData, indexBy, dataKey })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalDataKey).toEqual(dataKey)
  })
})

describe('Aggregate Data', () => {
  it('should use indexBy value to aggregate data', () => {
    const keys = ['amount']
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, keys, type: 'sum' })
    expect(data[0][indexBy]).toEqual(lineChartData[0][indexBy])
  })
  it('should use aggregate using sum', () => {
    const keys = ['amount']
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, keys, type: 'sum' })
    const countrySum = lineChartData.filter(o => o.country === data[0][indexBy]).reduce((sum, ele) => sum + ele[keys[0]], 0)
    expect(data[0][keys[0]]).toEqual(countrySum)
  })
  it('should use aggregate using min', () => {
    const keys = ['amount']
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, keys, type: 'min' })
    const countryMin = lineChartData
      .filter(o => o.country === data[0][indexBy])
      .reduce((min, ele) => Math.min(min === null ? ele[keys[0]] : min, ele[keys[0]]), null)
    expect(data[0][keys[0]]).toEqual(countryMin)
  })
  it('should use aggregate using max', () => {
    const keys = ['amount']
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, keys, type: 'max' })
    const countryMax = lineChartData
      .filter(o => o.country === data[0][indexBy])
      .reduce((max, ele) => Math.max(max === null ? ele[keys[0]] : max, ele[keys[0]]), null)
    expect(data[0][keys[0]]).toEqual(countryMax)
  })
  it('should use aggregate using avg', () => {
    const keys = ['amount']
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, keys, type: 'avg' })
    const countryData = lineChartData.filter(o => o.country === data[0][indexBy])
    const countryAvg = countryData.reduce((sum, ele, i) => {
      let ret = sum + ele[keys[0]]
      if (i === countryData.length - 1) ret /= countryData.length
      return ret
    }, 0)
    expect(data[0][keys[0]]).toEqual(countryAvg)
  })
})

describe('Aggregate Data - groupByKey', () => {
  it('should use indexBy value to aggregate data', () => {
    const valueKey = 'amount'
    const groupByKey = 'vehicle'
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, valueKey, groupByKey, type: 'sum' })
    expect(data[0][indexBy]).toEqual(lineChartData[0][indexBy])
  })
  it('should use aggregate using sum', () => {
    const valueKey = 'amount'
    const groupByKey = 'vehicle'
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, valueKey, groupByKey, type: 'sum' })
    const vehicleKey = lineChartData[0][groupByKey]
    // sum all 'amount' where 'country' and 'vehicle' equal first entry in data
    const countrySum = lineChartData.filter(o => o.country === data[0][indexBy] && o.vehicle == vehicleKey).reduce((sum, ele) => sum + ele[valueKey], 0)
    expect(data[0][vehicleKey]).toEqual(countrySum)
  })
  it('should use aggregate using min', () => {
    const valueKey = 'amount'
    const groupByKey = 'vehicle'
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, valueKey, groupByKey, type: 'min' })
    const vehicleKey = lineChartData[0][groupByKey]
    // min all 'amount' where 'country' and 'vehicle' equal first entry in data
    const countryMin = lineChartData
      .filter(o => o.country === data[0][indexBy] && o.vehicle == vehicleKey)
      .reduce((min, ele) => Math.min(min === null ? ele[valueKey] : min, ele[valueKey]), null)
    expect(data[0][vehicleKey]).toEqual(countryMin)
  })
  it('should use aggregate using max', () => {
    const valueKey = 'amount'
    const groupByKey = 'vehicle'
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, valueKey, groupByKey, type: 'max' })
    const vehicleKey = lineChartData[0][groupByKey]
    // max all 'amount' where 'country' and 'vehicle' equal first entry in data
    const countryMax = lineChartData
      .filter(o => o.country === data[0][indexBy] && o.vehicle == vehicleKey)
      .reduce((max, ele) => Math.max(max === null ? ele[valueKey] : max, ele[valueKey]), null)
    expect(data[0][vehicleKey]).toEqual(countryMax)
  })
  it('should use aggregate using avg', () => {
    const valueKey = 'amount'
    const groupByKey = 'vehicle'
    const indexBy = 'country'
    const data = aggregateData({ data: lineChartData, indexBy, valueKey, groupByKey, type: 'avg' })
    const vehicleKey = lineChartData[0][groupByKey]
    // avg all 'amount' where 'country' and 'vehicle' equal first entry in data
    const countryData = lineChartData.filter(o => o.country === data[0][indexBy] && o.vehicle == vehicleKey)
    const countryAvg = countryData.reduce((sum, ele, i) => {
      let ret = sum + ele[valueKey]
      if (i === countryData.length - 1) ret /= countryData.length
      return ret
    }, 0)
    expect(data[0][vehicleKey]).toEqual(countryAvg)
  })
})

describe('Convert Data to Nivo', () => {
  it('should use indexBy value to generate data series', () => {
    const indexByValue = true
    const xKey = 'visits'
    const yKeys = ['repeat_visits']
    const indexBy = 'address_city'
    const data = convertDataToNivo({ data: barChartData, xKey, yKeys, indexBy, indexByValue })
    expect(data[0].id).toEqual(barChartData[0][indexBy])
    expect(data[0].data[0].x).toEqual(barChartData[0][xKey])
    expect(data[0].data[0].y).toEqual(barChartData[0][yKeys[0]])
  })
  it('should use yKey to generate data series', () => {
    const xKey = 'address_city'
    const yKeys = ['visits', 'repeat_visits']
    const data = convertDataToNivo({ data: barChartData, xKey, yKeys })
    expect(data[0].id).toEqual(yKeys[0])
    expect(data[0].data[0].x).toEqual(barChartData[0][xKey])
    expect(data[1].id).toEqual(yKeys[1])
    expect(data[0].data[0].y).toEqual(barChartData[0][yKeys[0]])
  })
})

describe('Convert Pie Data to Nivo', () => {
  it('should use indexBy and dataKey to remap data', () => {
    const dataKey = 'visits'
    const indexBy = 'address_city'
    const data = convertPieDataToNivo({ data: barChartData, indexBy, dataKey })
    expect(data[0].id).toEqual(barChartData[0][indexBy])
    expect(data[0].value).toEqual(barChartData[0][dataKey])
  })
  it('should calculate the .percent field', () => {
    const dataKey = 'visits'
    const indexBy = 'address_city'
    const total = barChartData.reduce((sum, row) => sum + row[dataKey], 0)
    const data = convertPieDataToNivo({ data: barChartData, indexBy, dataKey })
    expect(data[0].id).toEqual(barChartData[0][indexBy])
    expect(data[0].value).toEqual(barChartData[0][dataKey])
    expect(data[0].percent).toEqual(`${(barChartData[0][dataKey] * 100 / total).toFixed(1)}%`)
  })
})
