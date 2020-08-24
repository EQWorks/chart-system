import React from 'react'
import { computeXYScalesForSeries } from '@nivo/scales'
import { getScaleTicks, getBarChartScales } from './nivo'
import {
  LEGEND_HEIGHT,
  TEXT_HEIGHT,
  FONT_SIZE,
  AXIS_TICK_WIDTH,
  AXIS_TICK_PADDING,
  BUFFER,
  SYMBOL_SIZE,
  SYMBOL_SPACING,
  TRIMMED_LEGEND_WIDTH,
  WIDTH_BREAKPOINT_3
} from '../constants/dimensions'
import designSystemColors, { hues, lightnesses } from '../constants/design-system-colors'

import { getBreakpoint, getElements } from './breakpoints'
import {
  getLeftMarginValues,
  getBottomMarginValues,
  getRightMarginValues,
  getRightLegendValues,
  getBottomLegendValues,
} from './margins'

import LegendCircle from '../../components/legend-symbol'

import omit from 'lodash.omit'


// "vendored" from https://github.com/mdevils/html-entities/blob/68a1a96/src/xml-entities.ts
const decodeXML = (str) => {
  const ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&',
  }
  if (!str || !str.length) {
    return ''
  }
  return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {
    if (s.charAt(1) === '#') {
      const code = s.charAt(2).toLowerCase() === 'x' ?
        parseInt(s.substr(3), 16) :
        parseInt(s.substr(2))

      if (isNaN(code) || code < -32768 || code > 65535) {
        return ''
      }
      return String.fromCharCode(code)
    }
    return ALPHA_INDEX[s] || s
  })
}

/**
 * Given a font size, we want to calculate the dimensions of the chart
 * The margin is the amount of space that the left axis ticks/legend, right legend or
 * bottom axis ticks/legend AND legend have
 * The margins should be the size of these elements + spacing
 */
/**
 * setChartMargin - sets the values of the chart margins
 * @param { number } width - width of the chart conatiner (ChartInner)
 * @param { number } heigth - height of the chart conatiner (ChartInner)
 * @param { boolean } useAxis - to decide on margin logic for charts with axis
 * @param { number } maxLegendLabelWidth - maximum length of a label/key text in the legend
 * @param { number } legendItemCount - number of items in the legend
 * @param { number } maxYAxisTickLabelWidth - the length of the maximum y-axis label value
 * @param { number } lastXAxisTickLabelWidth - the length of the highest x-axis label value
 * @param { number } maxRowLegendItems - number of legend items to display on the bottom chart legend
 * @param { boolean } trimLegend - to trim or not the legend items
 * @returns { object } - top, right, bottom, left margin values
 */
const setChartMargin = (
  width,
  height,
  useAxis,
  maxLegendLabelWidth,
  legendItemCount,
  maxYAxisTickLabelWidth,
  lastXAxisTickLabelWidth,
  maxRowLegendItems,
  trimLegend
) => {
  // default values
  /**
   * The top margin has to fit at least the half height of possible symbols sitting on the border
   * of the chart
   * Same with the right margin, when no other elements are present to the right of the chart
   */

  const top = useAxis ? TEXT_HEIGHT / 2 + 1 : 2 * BUFFER

  const isLandscape = isAspectRatio(width, height, aspectRatios.LANDSCAPE)
  const { widthBP, heightBP } = getBreakpoint({ width, height, isLandscape, legendItemCount })
  // ====[TODO] show legend condition based on height. Currently we hide it
  const elements = getElements({ widthBP, heightBP, isLandscape, legendItemCount, chartHeight })
  const leftValues = getLeftMarginValues({ ...elements.left, maxYAxisTickLabelWidth })
  const bottomValues = getBottomMarginValues(elements.bottom)

  const chartHeight = height - top - bottomValues.margin
  const showLegend = elements.bottom.showLegend || elements.right.showLegend
  const rightHandLegend = elements.right.showLegend

  const rightValues = getRightMarginValues({
    showBottomAxisTickLabels: elements.bottom.showAxisTickLabels,
    lastXAxisTickLabelWidth,
  })

  const rightLegendValues = getRightLegendValues({
    legendItemCount,
    width,
    chartHeight,
    maxLegendLabelWidth,
    minimumLegendWidth: TRIMMED_LEGEND_WIDTH,
    legendShowWidth: WIDTH_BREAKPOINT_3,
    trimLegend,
  })

  const finalRightMargin = showLegend && rightHandLegend ? rightLegendValues.rightMarginOverride : rightValues.margin

  const chartWidth = width - leftValues.margin - finalRightMargin

  const bottomLegendValues = getBottomLegendValues({
    chartWidth,
    legendItemCount,
    maxLegendLabelWidth,
    trimLegend,
    bottomAxisLegendLabelOffset: bottomValues.legendLabelOffset,
    useAxis,
  })

  // ====[TODO] support multiple legends
  const legendValues = rightHandLegend ? rightLegendValues : bottomLegendValues

  // ====[TODO clean naming
  // ====[TODO] unify 'anchor'
  // ====[TODO] spark chart styling
  // ====[TODO] review of useAxis
  return {
    top,
    right: finalRightMargin,
    bottom: bottomValues.margin,
    left: leftValues.margin,
    showLegend,
    rightHandLegend,
    rightHandLegendAnchor: rightLegendValues.anchor,
    legendItemWidth: legendValues.legendItemWidth,
    legendLabelContainerWidth: legendValues.legendLabelContainerWidth,
    showBottomAxisLegendLabel: elements.bottom.showAxisLegendLabel,
    showLeftAxisLegendLabel: elements.left.showAxisLegendLabel,
    showBottomAxisTicks: elements.bottom.showAxisTicks,
    showLeftAxisTicks: elements.left.showAxisTicks,
    showBottomAxisTickLabels: elements.bottom.showAxisTickLabels,
    showLeftAxisTickLabels: elements.left.showAxisTickLabels,
    bottomAxisLegendOffset: bottomValues.legendLabelOffset,
    leftAxisLegendOffset: leftValues.legendLabelOffset,
    legendTranslate: legendValues.legendTranslate,
    showBottomAxis: elements.bottom.showAxis,
    showLeftAxis: elements.left.showAxis,
  }
}

// NOTE: the below two functions implement axis scale calculations pulled from nivo (./nivo)
// in order to get the exact final axis labels, after d3 processing
export const getAxisLabelsBar = ({
  axisLeftLabelDisplayFn,
  axisBottomLabelDisplayFn,
  axisBottomLabelValues,
  ...options
}) => {
  const { xScale, yScale } = getBarChartScales(options)
  const xLabels = getScaleTicks(xScale, axisBottomLabelValues)
  const yLabels = getScaleTicks(yScale)

  return {
    xLabelCount: xLabels.length,
    lastXLabelWidth: getTextSize(axisBottomLabelDisplayFn(xLabels[xLabels.length - 1])),
    yLabelCount: yLabels.length,
    maxYLabelWidth: getLabelMaxWidth(yLabels,axisLeftLabelDisplayFn),
  }
}

export const getAxisLabelsSeries = ({
  data,
  xScale: xScaleSpec,
  yScale: yScaleSpec,
  width,
  height,
  axisBottomTickValues,
  axisBottomLabelDisplayFn,
  axisLeftLabelDisplayFn,
}) => {
  const { xScale, yScale } = computeXYScalesForSeries(data, xScaleSpec, yScaleSpec, width, height)
  const xLabels = getScaleTicks(xScale, axisBottomTickValues)
  const yLabels = getScaleTicks(yScale)

  return {
    xLabelCount: xLabels.length,
    lastXLabelWidth: getTextSize(axisBottomLabelDisplayFn(xLabels[xLabels.length - 1])),
    yLabelCount: yLabels.length,
    maxYLabelWidth: getLabelMaxWidth(yLabels,axisLeftLabelDisplayFn),
  }
}

/**
 * getLabelMaxWidth - calculates the width of the longest label text in the legend
 * @param { array } keys - array of keys that will be in the legend
 * @param { function } displayFn - function to apply on keys
 * @returns { number } - the width of the longest label text in the legend
 */
const getLabelMaxWidth = (keys, displayFn) => keys.reduce((max, key) =>
  Math.max(max, getTextSize(displayFn(key))), 0)

/**
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/50813259#50813259
 * getTextSize - calculates a rendered text width in pixels
 * @param { string } text - a text string
 * @param { string } font - a string with the font included ex: '12px noto sans'
 * @returns { number } - the width of the rendered text in pixels
 */
export const getTextSize = (text, font = '12px noto sans') => {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  context.font = font
  let width = typeof text === 'number'
    ? context.measureText(text).width
    : context.measureText(decodeXML(text)).width
  let textSize = Math.ceil(width)
  return textSize
}

/**
 * trimText - trims a text and adds '..' at the end
 * @param { string } text - a text string
 * @param { number } containerWidth - width of the text container in pixels
 * @param { number } count - used to add or not a suffix
 * @returns { string } - a trimmed text with '..' added at the end
 */
const TRIM = '..'
const trimText = (text, containerWidth, count = 0) => {
  if (text === '') return text
  let n = text.length
  const suffix = count ? TRIM : ''
  let textWidth = getTextSize(text.substr(0, n) + suffix)
  if (textWidth <= containerWidth) {
    return text.substr(0, n) + suffix
  } else {
    return trimText(text.substr(0, n - 1), containerWidth, count + 1)
  }
}

export const aspectRatios = {
  LANDSCAPE: 0,
  PORTRAIT: 1,
  ANY: 2
}

const getAspectRatio = (width, height) => {
  return width / height > 1 ? aspectRatios.LANDSCAPE : aspectRatios.PORTRAIT
}

export const isAspectRatio = (width, height, aspectRatio) => getAspectRatio(width, height) === aspectRatio

/**
 * trimLegendLabel - trims the labels of the leged
 * @param { number } legendLabelContainerWidth - the width that the label needs to fit in
 * @param { html } node - Legend html node
 */
export const trimLegendLabel = legendLabelContainerWidth => node => {
  if (node !== null) {
    const text = Array.from(node.parentNode.children).find(tag => tag.tagName === 'text')
    if (text) {
      // set its original value as attribute, so that we don't keep repeating
      if (!text.getAttribute('og-key')) {
        text.setAttribute('og-key', text.innerHTML)
      }
      let original = text.getAttribute('og-key') || text.innerHTML

      let label = original
      if (legendLabelContainerWidth) {
        label = trimText(original, legendLabelContainerWidth)
      }
      text.innerHTML = label
    }
  }
}

// not object params to re-use in x/y axis
// ====[NOTE]: showAxisTicks here is actually the labels
const getCommonAxisProps = (showAxisLegend, showAxisTicks, showAxisTickLabels, axisLegendLabel, legendOffset, displayFn = d => d) => ({
  tickSize: showAxisTicks ? AXIS_TICK_WIDTH : 0,
  tickPadding: showAxisTicks ? AXIS_TICK_PADDING : 0,
  legendHeight: LEGEND_HEIGHT,
  legendPosition: 'middle',
  legend: showAxisLegend ? axisLegendLabel : '',
  // TODO calculate a max width for each tick and trim
  // e.g. number of width / number of ticks
  format: (d) => showAxisTickLabels ? displayFn(d) : null,
  // legendOffset to position around the axis
  legendOffset,
})

export const getCommonProps = ({
  keys,
  height,
  width,
  useAxis,
  axisBottomTrim = true,
  axisBottomLabelDisplayFn = d => d,
  axisBottomTickValues,
  axisBottomLabelCount,
  lastXAxisTickLabelWidth,
  axisBottomLegendLabel, // not for pie
  axisLeftLegendLabel, // not for pie
  axisLeftLabelDisplayFn = d => d,
  maxYAxisTickLabelWidth = 0,
  dash, // not for pie?
  legendProps={},
  maxRowLegendItems,
  trimLegend
}) => {
  const maxLegendLabelWidth = getLabelMaxWidth(keys, (x) => x)
  const legendItemCount = keys.length

  const {
    showLegend,
    rightHandLegend,
    rightHandLegendAnchor,
    legendItemWidth,
    legendLabelContainerWidth,
    showBottomAxisLegendLabel,
    showLeftAxisLegendLabel,
    showBottomAxisTicks,
    showBottomAxisTickLabels,
    showLeftAxisTicks,
    showLeftAxisTickLabels,
    bottomAxisLegendOffset,
    leftAxisLegendOffset,
    legendTranslate,
    showBottomAxis,
    showLeftAxis,
    ...margin
  } = setChartMargin(
    width,
    height,
    useAxis,
    maxLegendLabelWidth,
    legendItemCount,
    maxYAxisTickLabelWidth,
    lastXAxisTickLabelWidth,
    maxRowLegendItems,
    trimLegend
  )

  const chartWidth = width - margin.right - margin.left

  const aspectRatioProps = rightHandLegend ? ({
    anchor: rightHandLegendAnchor,
    direction: 'column',
    // NOTE: itemWidth doesn't affect right legend
    itemWidth: 0,
    translateX: legendTranslate,
    translateY: 0,
  }) : ({
    anchor: 'bottom-left',
    direction: 'row',
    itemWidth: legendItemWidth,
    translateX: 0,
    translateY: legendTranslate,
  })
  const symbolShape = nivoProps => <LegendCircle {...nivoProps} trimLegendLabel={trimLegendLabel(legendLabelContainerWidth)} />
  const legend = {
    itemHeight: LEGEND_HEIGHT,
    symbolSize: SYMBOL_SIZE,
    symbolSpacing: SYMBOL_SPACING,
    symbolShape,
    ...aspectRatioProps,
    ...legendProps,
  }


  return {
    margin,
    axisBottom: showBottomAxis ? {
      tickValues: axisBottomTickValues,
      ...getCommonAxisProps(
        showBottomAxisLegendLabel,
        showBottomAxisTicks,
        showBottomAxisTickLabels,
        axisBottomLegendLabel,
        bottomAxisLegendOffset,
        d => axisBottomTrim
          ? trimText(axisBottomLabelDisplayFn(d)+'', chartWidth / axisBottomLabelCount)
          : axisBottomLabelDisplayFn(d)
      ),
    } : null, // ====[NOTE] null hides the axis
    axisLeft: showLeftAxis ? {
      orient: 'left',
      ...getCommonAxisProps(
        showLeftAxisLegendLabel,
        showLeftAxisTicks,
        showLeftAxisTickLabels,
        axisLeftLegendLabel,
        leftAxisLegendOffset,
        axisLeftLabelDisplayFn),
    } : null,
    legends: showLegend ? [legend] : [],
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
    theme: {
      fontSize: FONT_SIZE,
      // axis definition needed to display on top of the grid lines
      axis: {
        domain: {
          line: {
            stroke: 'black'
          }
        }
      },
      grid: {
        line: {
          stroke: '#dbdbdb',
          strokeWidth: 1,
          strokeDasharray: dash ? '5 5' : '' // only for line
        }
      }
    }
  }
}

const AGGREGATE_FN = {
  sum: (curr, val) => (curr || 0) + val,
  avg: (curr, val) => ({
    sum: (curr ? curr.sum : 0) + val,
    count: (curr ? curr.count : 0) + 1,
  }),
  max: (curr, val) => Math.max(curr === undefined ? val : curr, val),
  min: (curr, val) => Math.min(curr === undefined ? val : curr, val),
}

const aggregateReducer = ({ indexBy, genIndexKeys, genValueKey, type }) => (agg, ele) => ({
  ...agg,
  [ele[indexBy]]: {
    [indexBy]: ele[indexBy],
    ...(agg[ele[indexBy]] || {}),
    ...genIndexKeys(ele).reduce((ret, key) => {
      const curr = agg[ele[indexBy]] || {}
      ret[key] = AGGREGATE_FN[type](curr[key], ele[genValueKey(key)])
      return ret
    }, {})
  }
})

const avgMap = indexBy => ele => ({
  ...ele,
  // remove index key and calc average
  ...Object.keys(omit(ele, indexBy)).reduce((ret, key) => {
    ret[key] = ele[key].sum / ele[key].count
    return ret
  }, {})
})

// aggregate data based on unique value of indexBy and [keys]
// or, use groupByKey to map data into { [ele[groupByKey]]: valueKey }
export const aggregateData = ({ indexBy, data, keys, valueKey, groupByKey = '', type }) => {
  let genIndexKeys = () => keys
  let genValueKey = key => key
  if (groupByKey.length) {
    genIndexKeys = ele => [ele[groupByKey]]
    genValueKey = () => valueKey
  }
  const aggregation = Object.values(data.reduce(aggregateReducer({ indexBy, genIndexKeys, genValueKey, type }), {}))
  if (type === 'avg') {
    // { [indexBy]: id, [key]: { sum, count } }
    return aggregation.map(avgMap(indexBy))
  }
  return aggregation
}

export const processDataKeys = ({ indexBy = '', keys = [], groupByKey = '', data }) => {
  let finalIndexBy
  let finalKeys

  finalIndexBy = indexBy.length ? indexBy : Object.keys(data[0])[0]
  if (!groupByKey.length) {
    // remove indexBy from keys
    finalKeys = keys.length ? keys : Object.keys(omit(data[0], finalIndexBy))
  } else {
    // unique values of groupByKey
    finalKeys = Object.keys(data.reduce((agg, ele) => {
      agg[ele[groupByKey]] = true
      return agg
    }, {}))
  }

  return {
    finalKeys,
    finalIndexBy,
  }
}

// TODO: enforce validity of key combinations, e.g. providing no xKey and setting indexBy to keys[1]
export const processSeriesDataKeys = ({ indexBy = '', xKey = '', yKeys = [], data, indexByValue }) => {
  let finalIndexBy
  let finalXKey
  let finalYKeys
  const keys = Object.keys(data[0])
  if (indexByValue) {
    // requries an indexBy and only 1 yKey
    finalIndexBy = indexBy.length ? indexBy : keys[0]
    finalXKey = xKey.length ? xKey : keys[1]
    finalYKeys = yKeys.length ? yKeys : [keys[2]]
  } else {
    // one xKey and use the rest as yKeys
    finalXKey = xKey.length ? xKey : keys[0]
    finalYKeys = yKeys.length ? yKeys : keys.slice(1)
  }

  return {
    finalIndexBy,
    finalXKey,
    finalYKeys,
  }
}

export const processPieDataKeys = ({ data, indexBy, dataKey }) => {
  const keys = Object.keys(data[0])
  const finalIndexBy = indexBy.length ? indexBy : keys[0]
  const finalDataKey = dataKey.length ? dataKey : keys[1]
  return { finalIndexBy, finalDataKey }
}

export const convertPieDataToNivo = ({ data, indexBy, dataKey }) => {
  const total = data.reduce((sum, row) => sum + row[dataKey], 0)
  const finalData = data.map(o => ({
    id: o[indexBy],
    label: o[indexBy],
    value: o[dataKey],
    percent: `${(o[dataKey] * 100 / total).toFixed(1)}%`
  }))
  return finalData
}

// TODO: function for summing together values e.g. duplicate x/y combinations
// export const processUniqueData

// convert flat array { indexBy: 'value', ...rest }
// to grouped by unique indexBy value
// i.e. [{ id: 'value1', data: [{ ...rest }] }]
const convertDataToNivoByValue = ({ data, xKey, yKey, indexBy }) => Object.values(data.reduce((ret, ele) => {
  const id = ele[indexBy]
  if (!ret[id]) {
    ret[id] = { id, data: [] }
  }
  ret[id].data.push({ x: ele[xKey], y: ele[yKey] })
  return ret
}, {}))

// convert flat array { yKey1: value, yKey2: value, ...rest }
// to grouped by unique yKeys
// i.e. [{ id: yKey1, data: [] }, { id: yKey2, data: [] }]
const convertDataToNivoByKeys = ({ data, xKey, yKeys }) => Object.values(data.reduce((ret, ele) => {
  // generate an entry for each yKey
  yKeys.forEach(yKey => {
    const id = yKey
    if (!ret[id]) {
      ret[id] = { id, data: [] }
    }
    ret[id].data.push({ x: ele[xKey], y: ele[yKey] })
  })

  return ret
}, {}))

export const convertDataToNivo = ({ data, xKey, yKeys, indexBy, indexByValue }) => {
  if (indexByValue) return convertDataToNivoByValue({ data, xKey, yKey: yKeys[0], indexBy })
  return convertDataToNivoByKeys({ data, xKey, yKeys })
}

const COLOR_METHODS = {
  'random': num => {
    const colors = Object.values(designSystemColors)
    return new Array(num).fill(0).map(() => colors[Math.floor(Math.random() * colors.length)])
  },
  'monochromatic': (num, hue = 'blue') => {
    // return all values for keys that have `${hue}xx`
    // repeat if necessary
    let finalHue = hues.includes(hue) ? hue : 'blue'
    const colors = Object.keys(designSystemColors).filter(o => o.indexOf(finalHue) >= 0)
    return new Array(num).fill(0).map((_, i) => designSystemColors[colors[i % colors.length]])
  },
  'palette': (num, lightness = 30) => {
    // return all values for keys that have `hue${lightness}`
    // repeat if necessary
    let finalLightness = lightnesses.includes(parseInt(lightness)) ? lightness : 30
    const colors = Object.keys(designSystemColors).filter(o => o.indexOf(finalLightness) >= 0)
    return new Array(num).fill(0).map((_, i) => designSystemColors[colors[i % colors.length]])
  },
}

export const processColors = (numberOfColors, type, param) => {
  let finalType = type
  if (!COLOR_METHODS[type]) {
    finalType = 'palette'
  }
  return COLOR_METHODS[finalType](numberOfColors, param)
}

// enforce and order for string axis (Bar or xScale.type === 'point')
// Nivo uses the order of keys in data, so we have to sort
export const processAxisOrder = ({ data, axisBottomOrder, finalIndexBy, valueKey }) => {
  if (!axisBottomOrder.length) return data

  if (Array.isArray(axisBottomOrder)) {
    return axisBottomOrder.map(label => data.find(row => row[valueKey || finalIndexBy] === label))
  }
  const dir = axisBottomOrder === 'asc' ? 1 : -1
  return [...data].sort((a, b) => {
    if (a[valueKey || finalIndexBy] < b[valueKey || finalIndexBy]) {
      return -1 * dir
    } else if (a[valueKey || finalIndexBy] > b[valueKey || finalIndexBy]) {
      return 1 * dir
    }
    return 0
  })
}

// data structure of "Nivo" { id, data } requires different sorting
export const processAxisOrderNivo = ({ unsortedData, axisBottomOrder }) => unsortedData.map(({ data, id }) => ({
  id,
  data: processAxisOrder({ data, axisBottomOrder, valueKey: 'x' }),
}))
