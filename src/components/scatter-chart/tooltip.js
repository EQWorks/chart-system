import React from 'react'
import styled from 'styled-components'

const TooltipWrapper = styled.div`
  border-radius: 4px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  min-width: 99px;
  min-height: 63px;
  text-align: center;
`

const TooltipNode = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
`

const TooltipLabel = styled.strong`
  height: 17px;
  font-size: 12px;
`

const TooltipData = styled.div`
  font-size: 12px;
  margin: 0 5px;
`

const formatLabel = label => label.split('.')[0]

const tooltip = (node, axisBottomLegendLabel, axisLeftLegendLabel) => (
  <TooltipWrapper>
    <TooltipNode
      style={{ backgroundColor: node.style.color }}
    />
    <TooltipLabel>
      {formatLabel(node.id)}
    </TooltipLabel>
    <br />
    <TooltipData>
      {`${axisBottomLegendLabel}: ${node.data.formattedX}`}
    </TooltipData>
    <TooltipData>
      {`${axisLeftLegendLabel}: ${node.data.formattedY}`}
    </TooltipData>
  </TooltipWrapper>
)

export default tooltip
