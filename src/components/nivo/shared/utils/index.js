import React from 'react'
import { computeXYScalesForSeries } from '@nivo/scales'
import { getScaleTicks, getBarChartScales } from './nivo'
import {
  WIDTH_BREAKPOINT_1,
  WIDTH_BREAKPOINT_2,
  WIDTH_BREAKPOINT_3,
  HEIGHT_BREAKPOINT_1,
  HEIGHT_BREAKPOINT_2,
  HEIGHT_BREAKPOINT_3,
  AXIS_TICK_WIDTH,
  AXIS_TICK_PADDING,
  BUFFER,
  SYMBOL_SIZE,
  SYMBOL_SPACING,
  LEGEND_TRANSLATE_X,
  TRIMMED_LEGEND_WIDTH,
  LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH,
  LEGEND_ROW_FIXED_ELEMENTS_WIDTH,
} from '../constants/dimensions'
import designSystemColors, { hues, lightnesses } from '../../../../constants/design-system-colors'
import LegendCircle from '../../legend-symbol'

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
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/50813259#50813259
 * getTextSize - calculates a rendered text width and height in pixels
 * @param { string } text - a text string
 * @param { object } typographyProps - an object with font size, font family, and text color for the chart
 * @returns { object } - the width and height of the rendered text in pixels
 */
export const getTextSize = (text, typographyProps) => {
  let font = `${typographyProps.fontSize}px ${typographyProps.fontFamily}`
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  context.font = font
  let metrics = typeof text === 'number'
    ? context.measureText(text)
    : context.measureText(decodeXML(text))
  return {
    width: Math.ceil(metrics.width),
    height: Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent),
  }
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
 * @param { boolean } disableLegend - to display or not chartLegend
 * @param { number } text_height - chart text height in pixels
 * @param { number } legend_height - chart legend text height in pixels
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
  trimLegend,
  disableLegend,
  text_height,
  legend_height,
) => {
  // default values
  /**
   * The top margin has to fit at least the half height of possible symbols sitting on the border
   * of the chart
   * Same with the right margin, when no other elements are present to the right of the chart
   */

  let [
    top,
    right,
    bottom,
    left,
  ] = useAxis
    ? [
      SYMBOL_SIZE / 2 + 1,
      SYMBOL_SIZE / 2 + 1,
      AXIS_TICK_WIDTH,
      AXIS_TICK_WIDTH,
    ]
    : new Array(4).fill(BUFFER)

  const LEGEND_TRANSLATE_Y = legend_height + 3 * BUFFER

  // we only show x-axis tick labels and legend when chart width is large enough
  let showBottomAxisLegendLabel = false
  let showBottomAxisTicks = false
  // we only show y-axis tick labels and legend when chart height is large enough
  let showLeftAxisLegendLabel = false
  let showLeftAxisTicks = false

  let bottomAxisLegendOffset = text_height / 2 + AXIS_TICK_WIDTH + BUFFER
  let leftAxisLegendOffset = -(text_height / 2 + AXIS_TICK_WIDTH + BUFFER)
  // variable to set chart Legend offset
  let legendTranslate = LEGEND_TRANSLATE_Y

  // useAxis is the case when we have axis in a chart, for ex: bar, line, scatter charts
  if (useAxis) {
    // at HEIGHT_BREAKPOINT_2 we have both axis tick labels and x-axis legend visible
    if (height >= HEIGHT_BREAKPOINT_2) {
      /**
       * at HEIGHT_BREAKPOINT_2 the x-axis ticks appear in the chart, therefore, the right margin
       * has to adjust to include just over half of the last x-axis tick lable width
       */
      right = Math.max(right, lastXAxisTickLabelWidth * 0.6)
      showBottomAxisLegendLabel = true
      showBottomAxisTicks = true
      bottomAxisLegendOffset = bottomAxisLegendOffset + text_height + 1.5 * BUFFER
      bottom += 4 * BUFFER + 2 * text_height
    // at HEIGHT_BREAKPOINT_1 we show only x-axis legend
    } else if (height >= HEIGHT_BREAKPOINT_1) {
      showBottomAxisLegendLabel = true
      bottom += 3 * BUFFER + text_height
    }

    // when chart width >= WIDTH_BREAKPOINT_2 we show both y-axis tick and legend labels
    if (width >= WIDTH_BREAKPOINT_2) {
      showLeftAxisLegendLabel = true
      showLeftAxisTicks = true
      left += text_height + 3.5 * BUFFER + maxYAxisTickLabelWidth
      top = Math.max(top, text_height / 2 + 1)
      leftAxisLegendOffset= leftAxisLegendOffset - 2 * BUFFER - maxYAxisTickLabelWidth
    // when chart width >= WIDTH_BREAKPOINT_1 we only show y-axis legend label
    } else if (width >= WIDTH_BREAKPOINT_1) {
      showLeftAxisLegendLabel = true
      // text_height = axis legend height here
      left += text_height + 3 * BUFFER
    }
    legendTranslate = bottomAxisLegendOffset + 5 * BUFFER
  }

  // show right column legend when in landscape mode and number of legend items surpass maxRowLegendItems
  const rightHandLegend = isAspectRatio(width, height, aspectRatios.LANDSCAPE)
                          || legendItemCount > maxRowLegendItems
  // calculate height of column legend to hide it if it is larger than chart height
  const columnLegendHeight = legendItemCount * (legend_height +  BUFFER)
  /**
   * we hide legend when disableLegend===true, chart width is below WIDTH_BREAKPOINT_3,
   * and legend height is greater than the chart height and bottom margin
   */
  let showLegend = !disableLegend
    && width >= WIDTH_BREAKPOINT_3
    && columnLegendHeight <= height - 2 * BUFFER

  let rightHandLegendAnchor = columnLegendHeight <= height - top - bottom
    ? 'right'
    : 'top-right'

  if (!rightHandLegend && !disableLegend) {
    // row/bottom legend appears only if !disableLegend and after chart height >= HEIGHT_BREAKPOINT_3
    showLegend = height >= HEIGHT_BREAKPOINT_3
  }
  let legendLabelContainerWidth
  let legendItemWidth

  if (showLegend) {
    // adjust right or bottom margin accordingly
    if (rightHandLegend) {
      // default is difference between current and required space
      // enforce a minimum
      // increase the right margin until it fits the longest label
      legendTranslate = LEGEND_TRANSLATE_X
      const expandingLabelContainer = width - WIDTH_BREAKPOINT_3 - LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH - legendTranslate
      legendLabelContainerWidth = Math.max(expandingLabelContainer, TRIMMED_LEGEND_WIDTH)
      if (expandingLabelContainer >= maxLegendLabelWidth || !trimLegend) {
        legendLabelContainerWidth = maxLegendLabelWidth
      }
      right = legendLabelContainerWidth + legendTranslate + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
      legendItemWidth = legendLabelContainerWidth + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
    } else {
      legendItemWidth = (width - right - left) / legendItemCount
      legendLabelContainerWidth = trimLegend
        ? legendItemWidth - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
        : maxLegendLabelWidth
      // adjust bottom to include legend and a buffer
      bottom += legend_height + 2 * BUFFER
    }
  }
  return {
    top,
    right,
    bottom,
    left,
    showLegend,
    rightHandLegend,
    rightHandLegendAnchor,
    legendItemWidth,
    legendLabelContainerWidth,
    showBottomAxisLegendLabel,
    showLeftAxisLegendLabel,
    showBottomAxisTicks,
    showLeftAxisTicks,
    bottomAxisLegendOffset,
    leftAxisLegendOffset,
    legendTranslate,
  }
}

// NOTE: the below two functions implement axis scale calculations pulled from nivo (./nivo)
// in order to get the exact final axis labels, after d3 processing
export const getAxisLabelsBar = ({
  axisLeftLabelDisplayFn,
  axisBottomLabelDisplayFn,
  axisBottomLabelValues,
  typographyProps,
  ...options
}) => {
  const { xScale, yScale } = getBarChartScales(options)
  const xLabels = getScaleTicks(xScale, axisBottomLabelValues)
  const yLabels = getScaleTicks(yScale)

  return {
    xLabelCount: xLabels.length,
    lastXLabelWidth: xLabels.length ? getTextSize(axisBottomLabelDisplayFn(xLabels[xLabels.length - 1]), typographyProps).width : 0,
    yLabelCount: yLabels.length,
    maxYLabelWidth: getLabelMaxWidth(yLabels, typographyProps, axisLeftLabelDisplayFn),
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
  typographyProps,
}) => {
  const { xScale, yScale } = computeXYScalesForSeries(data, xScaleSpec, yScaleSpec, width, height)
  const xLabels = getScaleTicks(xScale, axisBottomTickValues)
  const yLabels = getScaleTicks(yScale)

  return {
    xLabelCount: xLabels.length,
    lastXLabelWidth: xLabels.length ? getTextSize(axisBottomLabelDisplayFn(xLabels[xLabels.length - 1]), typographyProps).width : 0,
    yLabelCount: yLabels.length,
    maxYLabelWidth: getLabelMaxWidth(yLabels, typographyProps, axisLeftLabelDisplayFn),
  }
}

/**
 * getLabelMaxWidth - calculates the width of the longest label text in the legend
 * @param { array } keys - array of keys that will be in the legend
 * @param { object } typographyProps - an object with font size, font family, and text color for the chart
 * @param { function } displayFn - function to apply on keys
 * @returns { number } - the width of the longest label text in the legend
 */
const getLabelMaxWidth = (keys, typographyProps, displayFn) => keys.reduce((max, key) =>
  Math.max(max, getTextSize(displayFn(key), typographyProps).width), 0)

/**
 * trimText - trims a text and adds '..' at the end
 * @param { string } text - a text string
 * @param { number } containerWidth - width of the text container in pixels
 * @param { object } typographyProps - an object with font size, font family, and text color for the chart
 * @param { number } count - used to add or not a suffix
 * @returns { string } - a trimmed text with '...' added at the end
 */
const TRIM = '...'
const trimText = (text, containerWidth, typographyProps, count = 0) => {
  if (text === '') return text
  let n = text.length
  const suffix = count ? TRIM : ''
  let textWidth = getTextSize(text.substr(0, n) + suffix, typographyProps).width
  if (textWidth <= containerWidth) {
    return text.substr(0, n) + suffix
  } else {
    return trimText(text.substr(0, n - 1), containerWidth, typographyProps, count + 1)
  }
}

export const aspectRatios = {
  LANDSCAPE: 0,
  PORTRAIT: 1,
  ANY: 2,
}

const getAspectRatio = (width, height) => {
  return width / height > 1 ? aspectRatios.LANDSCAPE : aspectRatios.PORTRAIT
}

export const isAspectRatio = (width, height, aspectRatio) => getAspectRatio(width, height) === aspectRatio

/**
 * trimLegendLabel - trims the labels of the legend
 * @param { number } legendLabelContainerWidth - the width that the label needs to fit in
 * @param { object } typographyProps - an object with font size, font family, and text color for the chart
 * @param { html } node - Legend html node
 */
export const trimLegendLabel = (legendLabelContainerWidth, typographyProps) => node => {
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
        label = trimText(original, legendLabelContainerWidth, typographyProps)
      }
      text.innerHTML = label
    }
  }
}

// not object params to re-use in x/y axis
const getCommonAxisProps = (showAxisLegend, showAxisTicks, axisLegendLabel, legendOffset, displayFn = d => d) => ({
  tickSize: AXIS_TICK_WIDTH,
  tickPadding: AXIS_TICK_PADDING,
  legendPosition: 'middle',
  legend: showAxisLegend ? axisLegendLabel : '',
  // TODO calculate a max width for each tick and trim
  // e.g. number of width / number of ticks
  format: (d) => showAxisTicks ? displayFn(d) : null,
  // legendOffset to position around the axis
  legendOffset,
})

export const getCommonProps = ({
  useAxis,
  keys,
  legendOnClick,
  currentColorMap = {}, // not for pie
  height,
  width,
  axisBottomTrim = true,
  axisBottomLegendLabel, // not for pie
  axisBottomLabelDisplayFn = d => d,
  axisBottomTickValues,
  axisBottomLabelCount,
  lastXAxisTickLabelWidth,
  axisLeftLegendLabel, // not for pie
  axisLeftLabelDisplayFn = d => d,
  maxYAxisTickLabelWidth = 0,
  legendProps={},
  maxRowLegendItems,
  trimLegend,
  disableLegend,
  typographyProps,
  dash, // not for pie?
}) => {
  const text_height = isNaN(typographyProps.fontSize)
    ? getTextSize('Typography', typographyProps)
    : typographyProps.fontSize

  // we keep legend_height in case we want to separate the font size for chart and chart legend
  const legend_height = text_height

  const maxLegendLabelWidth = getLabelMaxWidth(keys, typographyProps, (x) => x)
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
    showLeftAxisTicks,
    bottomAxisLegendOffset,
    leftAxisLegendOffset,
    legendTranslate,
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
    trimLegend,
    disableLegend,
    text_height,
    legend_height,
  )

  const chartWidth = width - margin.right - margin.left

  const aspectRatioProps = rightHandLegend ? ({
    anchor: rightHandLegendAnchor,
    direction: 'column',
    // NOTE: itemWidth affects wrapper of legend, which gets the onClick listener
    itemWidth: legendItemWidth,
    translateX: legendTranslate + legendItemWidth,
    translateY: 0,
  }) : ({
    anchor: 'bottom-left',
    direction: 'row',
    itemWidth: legendItemWidth,
    translateX: 0,
    translateY: legendTranslate,
  })

  const symbolShape = nivoProps =>
    <LegendCircle
      { ...nivoProps }
      trimLegendLabel={ trimLegendLabel(legendLabelContainerWidth, typographyProps) }
    />

  const legend = {
    id: 1,
    itemHeight: legend_height + BUFFER,
    symbolSize: SYMBOL_SIZE,
    symbolSpacing: SYMBOL_SPACING,
    symbolShape,
    ...aspectRatioProps,
    ...legendProps,
    effects: [
      {
        on: 'hover',
        style: {
          itemTextColor: '#000',
          itemBackground: '#eee',
        },
      },
    ],
    /* ====[NOTE]
      legend.data prop is overriden in Bar for BoxLegendSvg
      https://github.com/plouc/nivo/blob/259e037f52b0b4134dd2fa0abec221bcb9f939c1/packages/bar/src/Bar.js#L291

      and Scatter
      https://github.com/plouc/nivo/blob/259e037f52b0b4134dd2fa0abec221bcb9f939c1/packages/scatterplot/src/ScatterPlot.js#L82

      and Pie (but no layers[] override possible)
      https://github.com/plouc/nivo/blob/259e037f52b0b4134dd2fa0abec221bcb9f939c1/packages/pie/src/PieLegends.js#L15
    */
    onClick: legendOnClick,
    data: keys.map(key => ({
      label: key,
      id: key,
      // ====[TODO] "off" value as a prop
      // ====[TODO] grey out text as well or just more obvious off state
      color: currentColorMap[key] || 'rgba(150, 150, 150, 0.5)',
    })),
  }

  return {
    margin,
    axisBottom: {
      tickValues: axisBottomTickValues,
      ...getCommonAxisProps(
        showBottomAxisLegendLabel,
        showBottomAxisTicks,
        axisBottomLegendLabel,
        bottomAxisLegendOffset,
        d => axisBottomTrim
          ? trimText(axisBottomLabelDisplayFn(d)+'', chartWidth / axisBottomLabelCount, typographyProps)
          : axisBottomLabelDisplayFn(d),
      ),
    },
    axisLeft: {
      orient: 'left',
      ...getCommonAxisProps(
        showLeftAxisLegendLabel,
        showLeftAxisTicks,
        axisLeftLegendLabel,
        leftAxisLegendOffset,
        axisLeftLabelDisplayFn,
      ),
    },
    legends: showLegend ? [legend] : [],
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
    theme: {
      fontFamily: typographyProps.fontFamily,
      fontSize: typographyProps.fontSize,
      textColor: typographyProps.textColor,
      // axis definition needed to display on top of the grid lines
      axis: {
        domain: {
          line: {
            stroke: 'black',
          },
        },
      },
      grid: {
        line: {
          stroke: '#dbdbdb',
          strokeWidth: 1,
          strokeDasharray: dash ? '5 5' : '', // only for line
        },
      },
    },
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
    }, {}),
  },
})

const avgMap = indexBy => ele => ({
  ...ele,
  // remove index key and calc average
  ...Object.keys(omit(ele, indexBy)).reduce((ret, key) => {
    ret[key] = ele[key].sum / ele[key].count
    return ret
  }, {}),
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
    percent: `${(o[dataKey] * 100 / total).toFixed(1)}%`,
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
