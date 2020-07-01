import {
  processDataKeys,
  processSeriesDataKeys,
  convertDataToNivoByValue,
  convertDataToNivoByKeys,
  convertDataToNivo,
} from '../../src/shared/utils'
import barChartData from '../../src/shared/data/bar-chart-data'


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
})
