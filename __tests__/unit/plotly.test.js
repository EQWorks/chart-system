import mockData from '../../stories/data/plotly/mock-data-pie-bar.json'
import mockLineData from '../../stories/data/plotly/mock-data-line-scatter'
import mockScatterData from '../../stories/data/plotly/mock-data-line-scatter'
import mockPyramidData from '../../stories/data/plotly/mock-data-pyramid-bar'
import { getTextInfo, getAxisTitle, getMaxRange, getSum, getObjectByType } from '../../src/components/plotly/shared/utils'

describe('Get Text Info', () => {
  it('should return a label depending on props provided', () => {
    expect(getTextInfo({ showPercentage: false, showLabelName: false })).toEqual('none')
    expect(getTextInfo({ showPercentage: true, showLabelName: false })).toEqual('percent')
    expect(getTextInfo({ showPercentage: false, showLabelName: true })).toEqual('none')
    expect(getTextInfo({ showPercentage: true, showLabelName: true })).toEqual('label+percent')
  })
})

describe('Get Axis Title', () => {
  it('should label axis appropriately based on orientation', () => {
    const x = 'city'
    const y = ['stat1', 'stat2']
    expect(getAxisTitle('h', 'h', x, y)).toEqual({ text: 'city', standoff: 20 })
    expect(getAxisTitle('h', 'v', x, y)).toEqual({ text: false, standoff: 20 })
    expect(getAxisTitle('v', 'h', x, y)).toEqual({ text: false, standoff: 20 })
    expect(getAxisTitle('v', 'v', x, y)).toEqual({ text: 'city', standoff: 20 })
  })
})

describe('Get Max Range', () => {
  it('should return max value in a horizontal bar graph', () => {
    const _vBarData =   [
      {
        name: 'stat1',
        x: [
          'Longueuil',
          'Niagara Falls',
          'Montreal',
          'Saskatoon',
          'Vancouver',
        ],
        y: [
          53,
          13,
          41,
          52,
          32,
        ],
        orientation: 'v',
        text: [
          '53',
          '13',
          '41',
          '52',
          '32',
        ],
        textposition: 'none',
      },
      {
        name: 'stat2',
        x: [
          'Longueuil',
          'Niagara Falls',
          'Montreal',
          'Saskatoon',
          'Vancouver',
        ],
        y: [
          100,
          60,
          98,
          32,
          82,
        ],
        orientation: 'v',
        text: [
          '100',
          '60',
          '98',
          '32',
          '82',
        ],
        textposition: 'none',
      },
    ]

    const _hBarData = [
      {
        name: 'stat1',
        x: [
          53,
          13,
          41,
          52,
          32,
        ],
        y: [
          'Longueuil',
          'Niagara Falls',
          'Montreal',
          'Saskatoon',
          'Vancouver',
        ],
        orientation: 'h',
        text: [
          '53',
          '13',
          '41',
          '52',
          '32',
        ],
        textposition: 'outside',
      },
      {
        name: 'stat2',
        x: [
          100,
          60,
          98,
          32,
          82,
        ],
        y: [
          'Longueuil',
          'Niagara Falls',
          'Montreal',
          'Saskatoon',
          'Vancouver',
        ],
        orientation: 'h',
        text: [
          '100',
          '60',
          '98',
          '32',
          '82',
        ],
        textposition: 'outside',
      },
    ]

    const _pyramidData = [
      {
        name: 'man',
        x: [
          -600,
          -630,
          -660,
          -750,
          -850,
        ],
        y: [
          '10-14',
          '15-19',
          '20-24',
          '25-29',
          '30-34',
        ],
        orientation: 'h',
        text: [
          '600',
          '630',
          '660',
          '750',
          '850',
        ],
        textposition: 'outside',
      },
      {
        name: 'woman',
        x: [
          650,
          680,
          700,
          780,
          950,
        ],
        y: [
          '10-14',
          '15-19',
          '20-24',
          '25-29',
          '30-34',
        ],
        orientation: 'h',
        text: [
          '650',
          '680',
          '700',
          '780',
          '950',
        ],
        textposition: 'outside',
      },
    ]

    expect(getMaxRange(_vBarData, false)).toEqual(NaN)
    expect(getMaxRange(_hBarData, false)).toEqual(110)
    expect(getMaxRange(_pyramidData, false, 'pyramid')).toEqual(1000)
  })
})

describe('Get Sum', () => {
  it('should return the value of all X values from dataset', () => {
    expect(getSum(['man', 'woman'], mockPyramidData)).toEqual(7250)
  })
})

describe('Get Object By Type', () => {

  it('should return an object composed of values usable by a plotly bar graph', () => {
    const bar = getObjectByType(
      mockData, 
      'bar', 
      { input: 'x', output: 'x' }, 
      { input: 'y', output: 'y' }, 
      { x: 'city', y: [ 'stat1', 'stat2' ], orientation: 'v', textPosition: 'outside', titles: [], showLegend: true }, 
      'stat1', 
      undefined, 
      [],
      [],
      '',
      false,
    )

    expect(bar).toEqual({
      x: [
        'Longueuil',
        'Niagara Falls',
        'Montreal',
        'Vancouver',
        'Saskatoon',
        'Test',
        'Toronto',
      ],
      y: [
        53,
        13,
        41,
        52,
        32,
        32,
        32,
      ],
      orientation: 'v',
      text: [
        '53',
        '13',
        '41',
        '52',
        '32',
        '32',
        '32',
      ],
      textposition: 'none',
      hovertext: [
        '53',
        '13',
        '41',
        '52',
        '32',
        '32',
        '32',
      ],
    })
  })

  it('should return an object composed of values usable by a plotly line graph', () => {
    const line = getObjectByType(
      mockLineData,
      'line',
      { input: 'x', output: 'x' }, 
      { input: 'y', output: 'y' },
      { x: 'age', y: [ 'stat1', 'stat2' ], titles: [], showLegend: true },
      'stat1',
      undefined,
      [],
      [],
      '',
      false,
    )

    expect(line).toEqual({
      x: [
        18,
        25,
        27,
        34,
        36,
      ],
      y: [
        53,
        52,
        32,
        13,
        41,
      ],
      text: [
        '53',
        '52',
        '32',
        '13',
        '41',
      ],
      hovertext: [
        '53',
        '52',
        '32',
        '13',
        '41',
      ],
    })
  })

  it('should return an object composed of values usable by a plotly pie graph', () => {
    const pie = getObjectByType(
      mockData,
      'pie',
      { input: 'label', output: 'labels' }, 
      { input: 'value', output: 'values' },
      { label: 'city', values: [ 'stat1', 'stat2' ], titles: [], showLegend: true },
      'stat1',
      undefined,
      [],
      [],
      '',
      false,
    )

    expect(pie).toEqual({
      labels: [
        'Longueuil',
        'Niagara Falls',
        'Montreal',
        'Vancouver',
        'Saskatoon',
        'Test',
        'Toronto',
      ],
      values: [
        53,
        13,
        41,
        52,
        32,
        32,
        32,
      ],
      text: [
        '53',
        '13',
        '41',
        '52',
        '32',
        '32',
        '32',
      ],
      hovertext: [
        '53',
        '13',
        '41',
        '52',
        '32',
        '32',
        '32',
      ],
    })
  })

  it('should return an object composed of values usable by a plotly scatter graph', () => {
    const scatter = getObjectByType(
      mockScatterData,
      'scatter',
      { input: 'x', output: 'x' }, 
      { input: 'y', output: 'y' },
      { x: 'age', y: [ 'stat1', 'stat2' ], titles: [], showLegend: true },
      'stat1',
      undefined,
      [],
      [],
      '',
      false,
    )

    expect(scatter).toEqual({
      x: [
        18,
        25,
        27,
        34,
        36,
      ],
      y: [
        53,
        52,
        32,
        13,
        41,
      ],
      text: [
        '53',
        '52',
        '32',
        '13',
        '41',
      ],
      hovertext: [
        '53',
        '52',
        '32',
        '13',
        '41',
      ],
    })
  })
})
