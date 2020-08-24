import {
  LEGEND_HEIGHT,
  TEXT_HEIGHT, // TODO calculate this
  FONT_SIZE,
  BOTTOM_LEGEND_ADJUSTMENT,
  AXIS_TICK_WIDTH,
  AXIS_TICK_PADDING,
  BUFFER,
  LEGEND_TRANSLATE_X,
  LEGEND_TRANSLATE_Y,
  TRIMMED_LEGEND_WIDTH,
  LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH,
  LEGEND_ROW_FIXED_ELEMENTS_WIDTH
} from '../constants/dimensions'


export const getLeftMarginValues = ({
  showAxis,
  showAxisTicks,
  showAxisTickLabels,
  showAxisLegendLabel,
  maxYAxisTickLabelWidth,
}) => {
  let margin = 0
  let legendLabelOffset = -TEXT_HEIGHT / 2
  if (showAxisTicks) {
    margin += AXIS_TICK_WIDTH
    legendLabelOffset -= AXIS_TICK_WIDTH + AXIS_TICK_PADDING
  }
  if (showAxisTickLabels) {
    const axisLabelWidth = BUFFER + maxYAxisTickLabelWidth
    margin += axisLabelWidth
    legendLabelOffset -= axisLabelWidth
  }
  if (showAxisLegendLabel) {
    margin += TEXT_HEIGHT + 2 * BUFFER
  }
  return { margin, legendLabelOffset }
}

export const getBottomMarginValues = ({
  showAxis,
  showAxisTicks,
  showAxisTickLabels,
  showAxisLegendLabel,
  showLegend,
}) => {
  let margin = 0
  let legendLabelOffset = TEXT_HEIGHT / 2
  if (showAxisTicks) {
    margin += AXIS_TICK_WIDTH + AXIS_TICK_PADDING
    legendLabelOffset += AXIS_TICK_WIDTH + AXIS_TICK_PADDING
  }
  if (showAxisTickLabels) {
    const axisLabelHeight = TEXT_HEIGHT + BUFFER
    margin += axisLabelHeight
    legendLabelOffset += axisLabelHeight - BOTTOM_LEGEND_ADJUSTMENT // TODO: explain this value
  }
  if (showAxisLegendLabel) {
    margin += TEXT_HEIGHT + BUFFER
  }
  if (showLegend) {
    margin += LEGEND_HEIGHT + BUFFER
  }
  return { margin, legendLabelOffset }
}

export const getRightMarginValues = ({
  showBottomAxisTickLabels,
  lastXAxisTickLabelWidth,
}) => {
  let margin = TEXT_HEIGHT / 2 + 1
  if (showBottomAxisTickLabels) {
    margin = Math.max(margin, lastXAxisTickLabelWidth * 0.6)
  }
  return { margin }
}

export const getBottomLegendValues = ({
  chartWidth,
  legendItemCount,
  maxLegendLabelWidth,
  trimLegend,
  bottomAxisLegendLabelOffset,
  useAxis,
}) => {
  const anchor = 'bottom-left'

  let legendTranslate = LEGEND_TRANSLATE_Y
  const legendItemWidth = chartWidth / legendItemCount
  const legendLabelContainerWidth = trimLegend
    ? legendItemWidth - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
    : maxLegendLabelWidth

  // TODO: how does useAxis fit into modular paradigm?
  if (useAxis) {
    legendTranslate = bottomAxisLegendLabelOffset + 4.5 * BUFFER
  }

  return {
    anchor,
    legendTranslate,
    legendLabelContainerWidth,
    legendItemWidth,
  }
}

export const getRightLegendValues = ({
  width,
  legendItemCount,
  maxLegendLabelWidth,
  chartHeight,
  trimLegend,
  // ====[TODO] should it only be showAfter for each element, instead of specifiying the state of breakpoint?
  minimumLegendWidth,
  // ====[TODO] how is the legend width affect
  legendShowWidth,
}) => {
  const columnLegendHeight = legendItemCount * LEGEND_HEIGHT
  const anchor = columnLegendHeight <= chartHeight ? 'right' : 'top-right'
  const legendTranslate = LEGEND_TRANSLATE_X

  // default is difference between current and required space, enforce a minimum
  // increase the right margin until it fits the longest label
  let legendLabelContainerWidth
  const expandingLabelContainer = width - legendShowWidth - LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH - legendTranslate
  legendLabelContainerWidth = Math.max(expandingLabelContainer, minimumLegendWidth)
  if (expandingLabelContainer >= maxLegendLabelWidth || !trimLegend) {
    legendLabelContainerWidth = maxLegendLabelWidth
  }

  // ===[TODO]: what if last x axis tick is longer?
  const rightMarginOverride = legendLabelContainerWidth + legendTranslate + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH

  return {
    anchor,
    legendTranslate,
    legendLabelContainerWidth,
    rightMarginOverride,
  }
}

// TODO legend
