import React, { useEffect, useMemo, useState } from 'react'

import { styled, setup } from 'goober'
import { Line } from '@nivo/line'

import { withWrapper } from '../chart-wrapper'
import Tooltip from '../tooltip'
import { useLegendToggle } from '../hooks'
import {
  getCommonProps,
  processSeriesDataKeys,
  convertDataToNivo,
  processColors,
  processAxisOrderNivo,
  getAxisLabelsSeries,
} from '../../shared/utils'
import {
  chartPropTypes,
  chartDefaultProps,
  seriesPropTypes,
  seriesDefaultProps,
  typographyPropTypes,
  typographyDefaultProps,
} from '../../shared/constants/chart-props'
import { DATA_HOVER_OPACITY } from '../../shared/constants/dimensions'

setup(React.createElement)

const Container = styled('div')`
  height: 100%;
  width: 100%;
`
const propTypes = {
  ...typographyPropTypes,
  ...seriesPropTypes,
  ...chartPropTypes,
}
const defaultProps = {
  ...typographyDefaultProps,
  ...seriesDefaultProps,
  ...chartDefaultProps,
}

const mouseOut = (event) => {
  const container = event.target
  // event target changes depending on what the cursor leaves from
  if (container.tagName === 'rect') {
    container.parentNode.parentNode.getElementsByTagName('path').forEach(p => p.style.opacity = 1.0)
  } else if (container.tagName === 'svg') {
    container.children[1].getElementsByTagName('path').forEach(p => p.style.opacity = 1.0)
  }
}

// LineChart - creates a line chart
const ResponsiveLineChart = ({
  data,
  indexByValue,
  indexBy,
  xKey,
  yKeys,
  colors,
  colorType,
  colorParam,
  axisBottomLegendLabel,
  axisBottomTrim,
  axisBottomLabelDisplayFn,
  axisBottomOrder,
  axisBottomLabelValues,
  axisLeftLabelDisplayFn,
  xScale,
  axisLeftLegendLabel,
  yScale,
  width,
  height,
  maxRowLegendItems,
  trimLegend,
  disableLegend,
  tooltipFormat,
  tooltipFormatX,
  typographyProps,
  ...nivoProps
}) => {
  const {
    finalXKey,
    finalYKeys,
    nivoData,
    baseDataToColorMap,
  } = useMemo(() => {
    const {
      finalIndexBy,
      finalXKey,
      finalYKeys,
    } = processSeriesDataKeys({ data, indexBy, xKey, yKeys, indexByValue })
    const unsortedData = convertDataToNivo({ data, indexBy: finalIndexBy, xKey: finalXKey, yKeys: finalYKeys, indexByValue })
    const nivoData = processAxisOrderNivo({ unsortedData, axisBottomOrder })
    const baseColors = colors.length ? colors : processColors(nivoData.length, colorType, colorParam)
    // ====[TODO] flexible/repeat nature of colors could screw up { id: color } map
    // =========] would need to include repeat logic here?
    const baseDataToColorMap = nivoData.reduce((agg, o, i) => ({ ...agg, [o.id]: baseColors[i] }), {})
    return {
      finalXKey,
      finalYKeys,
      nivoData,
      baseDataToColorMap,
    }
  }, [data, indexBy, xKey, yKeys, indexByValue, axisBottomOrder])
 
  const [finalData, setFinalData] = useState(nivoData)
  const [currentColorMap, setCurrentColorMap] = useState(baseDataToColorMap)
  useEffect(() => {
    setFinalData(nivoData)
  }, [nivoData])
  
  useEffect(() => {
    setCurrentColorMap(finalData.reduce((agg, o) => ({ ...agg, [o.id]: baseDataToColorMap[o.id] }), {}))
  }, [finalData])

  const finalColors = finalData.map(({ id }) => currentColorMap[id])

  const finalXScale = { type: 'linear', ...xScale }
  const finalYScale = { type: 'linear', ...yScale }
  const axisBottomTickValues = axisBottomLabelValues

  const toggleDataSeries = id => {
    setFinalData(prevData => {
      const idx = prevData.findIndex(o => o.id === id)
      if (idx < 0) {
        // ====[NOTE] data & colors are matched by index, so add back in to original position
        const ogIdx = nivoData.findIndex(o => o.id === id)
        return [...prevData.slice(0, ogIdx), nivoData[ogIdx], ...prevData.slice(ogIdx)]
      }
      return [...prevData.slice(0, idx), ...prevData.slice(idx + 1)]
    })
  }

  const {
    xLabelCount: axisBottomLabelCount,
    lastXLabelWidth: lastXAxisTickLabelWidth,
    maxYLabelWidth: maxYAxisTickLabelWidth,
  } = useMemo(
    () => getAxisLabelsSeries({
      data: finalData,
      xScale: finalXScale,
      yScale: finalYScale,
      width,
      height,
      axisBottomTickValues,
      axisBottomLabelDisplayFn,
      axisLeftLabelDisplayFn,
      typographyProps,
    }),
    [
      finalData,
      finalXScale,
      finalYScale,
      width,
      height,
      axisBottomTickValues,
      axisBottomLabelDisplayFn,
      axisLeftLabelDisplayFn,
      typographyProps,
    ],
  )

  const legendToggle = useLegendToggle(data)
  return (
    // NOTE: onMouseLeave and onMouseEnter events not firing correctly
    // https://github.com/plouc/nivo/issues/756
    <Container onMouseOut={ mouseOut }>
      <Line
        { ...nivoProps }
        height={ height }
        width={ width }
        data={ finalData }
        colors={ finalColors }
        xScale={ finalXScale }
        yScale={ finalYScale }
        pointColor={{ theme: 'background' }}
        pointBorderWidth={ 0 }
        pointBorderColor={{ from: 'serieColor' }}
        useMesh={ true }
        enableCrosshair={ true }
        crosshairType='bottom'
        onMouseMove={ (d, event) => {
          let dataPoints = Array.from(event.target.parentNode.parentNode.getElementsByTagName('path'))
          let hoverItemIndex = finalData.findIndex(o => d.serieId === o.id)
          let hovered = dataPoints.splice(hoverItemIndex, 1)
          hovered[0].style.opacity = 1.0
          dataPoints.forEach(point => {
            point.style.opacity = DATA_HOVER_OPACITY
          })
        } }
        tooltip={ ({ point }) => (
          <Tooltip
            color={ point.borderColor }
            label={ point.serieId }
            display={ [
              { label: axisBottomLegendLabel, value: tooltipFormatX(point.data.x) },
              { label: axisLeftLegendLabel, value: tooltipFormat(point.data.y) },
            ] }
            typography={ typographyProps }
          />
        ) }
        { ...getCommonProps({
          data,
          useAxis: true,
          yKeys: finalYKeys,
          xKey: finalXKey,
          keys: nivoData.map(o => o.id),
          currentColorMap,
          toggleDataSeries,
          height,
          width,
          axisBottomLegendLabel,
          axisLeftLegendLabel,
          dash: true,
          axisBottomTrim,
          axisBottomLabelDisplayFn,
          axisBottomTickValues,
          axisBottomLabelCount,
          lastXAxisTickLabelWidth,
          axisLeftLabelDisplayFn,
          maxYAxisTickLabelWidth,
          maxRowLegendItems,
          trimLegend,
          disableLegend,
          typographyProps,
        }) }
        { ...legendToggle }
      >
      </Line>
    </Container>
  )
}

ResponsiveLineChart.defaultProps = defaultProps
ResponsiveLineChart.propTypes = propTypes

export default withWrapper(ResponsiveLineChart)
