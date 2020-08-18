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
  showRightHandLegend,
  legendLabelContainerWidth,
  legendTranslate,
  showBottomAxisTickLabels,
  lastXAxisTickLabelWidth,
}) => {
  let margin = TEXT_HEIGHT / 2 + 1
  if (showBottomAxisTickLabels) {
    margin = Math.max(margin, lastXAxisTickLabelWidth * 0.6)
  }
  if (showRightHandLegend) {
    // TODO: what if axis tick is longer?
    margin = legendLabelContainerWidth + legendTranslate + LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH
  }
  return { margin }
}

// NOTE: right or bottom legend is implicit
export const getLegendValues = ({
  legendItemCount,
  maxLegendLabelWidth,
  rightHandLegend,
  chartHeight,
  chartWidth,
  bottomAxisLegendLabelOffset,
  trimLegend,
  width,
}) => {
  const columnLegendHeight = legendItemCount * LEGEND_HEIGHT
  // NOTE: just for right legend
  // let showLegend = width >= WIDTH_BREAKPOINT_3
  //   t               && columnLegendHeight <= height - top
  let anchor = 'bottom-left'
  if (rightHandLegend) {
    if (columnLegendHeight <= chartHeight) {
      anchor = 'right'
    } else {
      anchor = 'top-right'
    }
  }

  let legendTranslate
  let legendLabelContainerWidth
  let legendItemWidth
  if (rightHandLegend) {
    // default is difference between current and required space
    // enforce a minimum
    // increase the right margin until it fits the longest label
    legendTranslate = LEGEND_TRANSLATE_X
    // TODO: how does this legend trimming fit into modular paradigm?
    const expandingLabelContainer = width - WIDTH_BREAKPOINT_3 - LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH - legendTranslate
    legendLabelContainerWidth = Math.max(expandingLabelContainer, TRIMMED_LEGEND_WIDTH)
    if (expandingLabelContainer >= maxLegendLabelWidth || !trimLegend) {
      legendLabelContainerWidth = maxLegendLabelWidth
    }
  } else {
    legendItemWidth = chartWidth / legendItemCount
    legendLabelContainerWidth = trimLegend
      ? legendItemWidth - LEGEND_ROW_FIXED_ELEMENTS_WIDTH
      : maxLegendLabelWidth
    // adjust bottom to include legend and a buffer
    legendTranslate = LEGEND_TRANSLATE_Y
    // TODO: how does useAxis fit into modular paradigm?
    if (useAxis) {
      legendTranslate = bottomAxisLegendLabelOffset + 4.5 * BUFFER
    }
  }

  return {
    anchor,
    legendTranslate,
    legendItemWidth,
    legendLabelContainerWidth,
  }
}

// TODO legend