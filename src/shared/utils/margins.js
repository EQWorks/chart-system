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

// TODO: getRightMarginValues
