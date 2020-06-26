export const WIDTH_BREAKPOINT_0 = 208
export const WIDTH_BREAKPOINT_1 = 232
export const WIDTH_BREAKPOINT_2 = 256
export const WIDTH_BREAKPOINT_3 = 336
export const HEIGHT_BREAKPOINT_1 = 206
export const HEIGHT_BREAKPOINT_2 = 230
// TO REMOVE:
// I would change the HEIGHT_BREAKPOINT_3 to 285 value, down from a value of 310. Initial design
// included a second legend row and a buffer = 25px, which we don't have in the version of the chart
// we are creating, whcih includes only one row of legend items.
// export const HEIGHT_BREAKPOINT_3 = 310
export const HEIGHT_BREAKPOINT_3 = 285
export const AXIS_TICK_WIDTH = 8
export const AXIS_TICK_PADDING = 8
/**
 * BOTTOM_LEGEND_ADJUSTMENT - was defined to adjust the x-axis legend distance to the x-axis
 * tick labels (which should be 8px), so the legend sits exactly the same distance that the
 * y-axis legend is positioned relative to the y-axis tick labels. This adjustment is needed to
 * solve some of the limitations found when implementing Nivo charts to fit design specifications.
 */
export const BOTTOM_LEGEND_ADJUSTMENT = 8
export const LEGEND_HEIGHT = 17
export const TEXT_HEIGHT = 17
export const BUFFER = 8
export const SYMBOL_SIZE = 8
export const SYMBOL_SPACING = 6
export const FONT_SIZE = 12
// minimum width in pixels of the legend keys when we start trimming if necessary
export const TRIMMED_LEGEND_WIDTH = 42
export const LEGEND_TRANSLATE_X = 14
export const COLUMN_LEGEND_ITEM_MARGIN = 12
// all spaces around and elements of the column legend, everything minus key length in pixels
export const LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH = SYMBOL_SIZE + SYMBOL_SPACING + COLUMN_LEGEND_ITEM_MARGIN
// 31 = 8(symbol-circle) + 6(buffer to key) + 17(margin right)
// all spaces of an item of the row legend, everything minus key length in pixels
export const LEGEND_ROW_FIXED_ELEMENTS_WIDTH = SYMBOL_SIZE + SYMBOL_SPACING + BUFFER
