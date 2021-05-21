import PropTypes from 'prop-types'

import { MAX_LEGEND_ITEMS_ROW } from './dimensions'


export const chartPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  indexBy: PropTypes.string,
  colors: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
  ]),
  colorType: PropTypes.string, // TODO oneOf(['random', 'palette', 'monochromatic'])
  colorParam: PropTypes.string, // value to configure the colorType, currently the hue (mono) or lightness (palette)
  axisBottomLegendLabel: PropTypes.string,
  axisBottomTrim: PropTypes.bool,
  axisBottomLabelDisplayFn: PropTypes.func,
  axisBottomOrder: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.oneOf(['asc', 'desc']),
  ]),
  axisBottomLabelValues: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.string,
    PropTypes.object, //for time
  ]),
  axisLeftLegendLabel: PropTypes.string,
  axisLeftLabelDisplayFn: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  maxRowLegendItems: PropTypes.number,
  trimLegend: PropTypes.bool,
  disableLegend: PropTypes.bool,
  tooltipFormat: PropTypes.func,
  tooltipFormatX: PropTypes.func,
  disableTooltipTitle: PropTypes.bool,
}

export const chartDefaultProps = {
  indexBy: '',
  colors: [],
  colorType: 'palette',
  colorParam: '70',
  axisBottomLegendLabel: '',
  axisBottomTrim: true,
  axisBottomLabelDisplayFn: d => d,
  axisBottomOrder: [],
  axisBottomLabelValues: undefined,
  axisLeftLegendLabel: '',
  axisLeftLabelDisplayFn: d => d,
  width: 100,
  height: 100,
  maxRowLegendItems: MAX_LEGEND_ITEMS_ROW,
  trimLegend: true,
  disableLegend: false,
  tooltipFormat: v => v,
  tooltipFormatX: v => v,
  disableTooltipTitle: false,
}

export const seriesPropTypes = {
  indexByValue: PropTypes.bool,
  xKey: PropTypes.string,
  xScale: PropTypes.object,
  yScale: PropTypes.object,
  yKeys: PropTypes.array,
}

export const seriesDefaultProps = {
  indexByValue: true,
  xKey: '',
  xScale: {},
  yScale: {},
  yKeys: [],
}

export const barChartPropTypes = {
  keys: PropTypes.array,
  groupByKey: PropTypes.string,
  valueKey: PropTypes.string,
}

export const barChartDefaultProps = {
  keys: [],
  groupByKey: '',
  valueKey: '',
}

export const typographyPropTypes = {
  typographyProps: PropTypes.shape({
    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    textColor: PropTypes.string.isRequired,
  }),
}

export const typographyDefaultProps = {
  typographyProps: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 12,
    textColor: 'black',
  },
}
