import {
  processDataKeys,
  processSeriesDataKeys,
  convertDataToNivo,
} from '../../src/shared/utils'
import barChartData from '../../src/shared/data/bar-chart-data'
import lineChartData from '../../src/shared/data/line-chart-data'


describe('Process Data Keys', () => {
  it('should default to first key and ...rest', () =>{
    const { finalIndexBy, finalKeys } = processDataKeys({ data: barChartData })
    const keys = Object.keys(barChartData[0])
    expect(finalIndexBy).toEqual(keys[0])
    expect(finalKeys).toEqual(keys.slice(1))
  })
  it('should remove indexBy keys by default', () =>{
    const indexBy = 'address_city'
    const { finalIndexBy, finalKeys } = processDataKeys({ indexBy, data: barChartData })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalKeys.includes(indexBy)).toBeFalsy()
  })
  it('should return provided values', () =>{
    const indexBy = 'address_city'
    const keys = ['visits', 'repeat_visits']
    const { finalIndexBy, finalKeys } = processDataKeys({ indexBy, keys, data: barChartData })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalKeys).toEqual(keys)
  })
  it('should return keys based on value of groupByKey', () =>{
    const indexBy = 'country'
    const groupByKey = 'vehicle'
    const { finalIndexBy, finalKeys } = processDataKeys({ indexBy, groupByKey, data: lineChartData })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalKeys[0]).toEqual(lineChartData[0][groupByKey])
  })
})

describe('Process Series Data Keys', () => {
  it('should default to first 3 keys - indexByValue', () =>{
    const indexByValue = true
    const { finalIndexBy, finalXKey, finalYKeys } = processSeriesDataKeys({ data: barChartData, indexByValue })
    const keys = Object.keys(barChartData[0])
    expect(finalIndexBy).toEqual(keys[0])
    expect(finalXKey).toEqual(keys[1])
    expect(finalYKeys).toEqual([keys[2]])
  })
  it('should return provided values - indexByValue', () =>{
    const indexByValue = true
    const indexBy = 'address_city'
    const xKey = 'visits'
    const yKeys = ['repeat_visitors']
    const { finalIndexBy, finalXKey, finalYKeys } = processSeriesDataKeys({ data: barChartData, indexByValue, indexBy, xKey, yKeys })
    expect(finalIndexBy).toEqual(indexBy)
    expect(finalXKey).toEqual(xKey)
    expect(finalYKeys).toEqual(yKeys)
  })
  it('should return provided values - indexByKey', () =>{
    const xKey = 'visits'
    const yKeys = ['repeat_visitors']
    const { finalIndexBy, finalXKey, finalYKeys } = processSeriesDataKeys({ data: barChartData, xKey, yKeys })
    expect(finalIndexBy).toEqual(undefined)
    expect(finalXKey).toEqual(xKey)
    expect(finalYKeys).toEqual(yKeys)
  })
})

describe('Convert Data to Nivo', () => {
  it('should use indexBy value to generate data series', () =>{
    const indexByValue = true
    const xKey = 'visits'
    const yKeys = ['repeat_visits']
    const indexBy = 'address_city'
    const data = convertDataToNivo({ data: barChartData, xKey, yKeys, indexBy, indexByValue })
    expect(data[0].id).toEqual(barChartData[0][indexBy])
    expect(data[0].data[0].x).toEqual(barChartData[0][xKey])
    expect(data[0].data[0].y).toEqual(barChartData[0][yKeys[0]])
  })
  it('should use yKey to generate data series', () =>{
    const xKey = 'address_city'
    const yKeys = ['visits', 'repeat_visits']
    const data = convertDataToNivo({ data: barChartData, xKey, yKeys })
    expect(data[0].id).toEqual(yKeys[0])
    expect(data[0].data[0].x).toEqual(barChartData[0][xKey])
    expect(data[1].id).toEqual(yKeys[1])
    expect(data[0].data[0].y).toEqual(barChartData[0][yKeys[0]])
  })
})
