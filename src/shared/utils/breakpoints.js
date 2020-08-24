import {
  WIDTH_BREAKPOINT_1,
  WIDTH_BREAKPOINT_2,
  WIDTH_BREAKPOINT_3,
  HEIGHT_BREAKPOINT_1,
  HEIGHT_BREAKPOINT_2,
  HEIGHT_BREAKPOINT_3,
  MAX_LEGEND_ITEMS_ROW,
} from '../constants/dimensions'

const WBP1 = 'w-bp1'
const WBP2 = 'w-bp2'
const WBP3 = 'w-bp3'
const WBP4 = 'w-bp4'
const HBP1 = 'h-bp1'
const HBP2 = 'h-bp2'
const HBP3 = 'h-bp3'
const HBP4 = 'h-bp4'

/* ===== ELEMENTS

axis
axisTicks
axisTickLabels
axisLegendLabel
legend

*/

// TODO elements become functions to remove the showLegend override
// ---- what gets passed in the callback? ({ isLandscape })
const BOTTOM_ELEMENTS = {
  [HBP1]: {
    showAxis: false,
    showAxisTicks: false,
    showAxisTickLabels: false,
    showAxisLegendLabel: false,
    showLegend: () => false,
  },
  [HBP2]: {
    showAxis: true,
    showAxisTicks: true,
    showAxisTickLabels: false,
    showAxisLegendLabel: true,
    showLegend: () => false,
  },
  [HBP3]: {
    showAxis: true,
    showAxisTicks: true,
    showAxisTickLabels: true,
    showAxisLegendLabel: true,
    showLegend: () => false,
  },
  [HBP4]: {
    showAxis: true,
    showAxisTicks: true,
    showAxisTickLabels: true,
    showAxisLegendLabel: true,
    showLegend: ({ isLandscape, legendItemCount }) => !isLandscape && (legendItemCount <= MAX_LEGEND_ITEMS_ROW),
  },
}

const LEFT_ELEMENTS = {
  [WBP1]: {
    showAxis: false,
    showAxisTicks: false,
    showAxisTickLabels: false,
    showAxisLegendLabel: false,
  },
  [WBP2]: {
    showAxis: true,
    showAxisTicks: true,
    showAxisTickLabels: false,
    showAxisLegendLabel: true,
  },
  [WBP3]: {
    showAxis: true,
    showAxisTicks: true,
    showAxisTickLabels: true,
    showAxisLegendLabel: true,
  },
  [WBP4]: {
    showAxis: true,
    showAxisTicks: true,
    showAxisTickLabels: true,
    showAxisLegendLabel: true,
  },
}

const RIGHT_ELEMENTS = {
  [WBP1]: { showLegend: () => false },
  [WBP2]: { showLegend: () => false },
  [WBP3]: { showLegend: () => false },
  [WBP4]: { showLegend: ({ isLandscape, legendItemCount }) => isLandscape || (legendItemCount > MAX_LEGEND_ITEMS_ROW) },
}

export const getElements = ({ widthBP, heightBP, isLandscape, legendItemCount }) => ({
  // override showLegend with its function
  left: LEFT_ELEMENTS[widthBP],
  bottom: { ...BOTTOM_ELEMENTS[heightBP], showLegend: BOTTOM_ELEMENTS[heightBP].showLegend({ isLandscape, legendItemCount }) },
  right: { ...RIGHT_ELEMENTS[widthBP], showLegend: RIGHT_ELEMENTS[widthBP].showLegend({ isLandscape, legendItemCount }) },
})

export const getBreakpoint = ({ width, height }) => ({
  widthBP: width >= WIDTH_BREAKPOINT_3 ? WBP4 : (width >= WIDTH_BREAKPOINT_2 ? WBP3 : (width >= WIDTH_BREAKPOINT_1 ? WBP2 : WBP1)),
  heightBP: height >= HEIGHT_BREAKPOINT_3 ? HBP4 : (height >= HEIGHT_BREAKPOINT_2 ? HBP3 : (height >= HEIGHT_BREAKPOINT_1 ? HBP2 : HBP1))
})

// >= 3 // show legend
// >= 2 // show axisTickLabels, show axisLegendLabel
// >= 1 // show axisLegendLabel
// < 1 // show axis, show ticks

// 0 < WBP2 = 1
// WBP2 < WBP3 = 2
// WBP3 < WBP4 = 3
// WBP4 < X = 4

// TODO: 0th breakpoint
