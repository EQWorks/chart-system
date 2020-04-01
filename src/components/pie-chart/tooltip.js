import React from 'react'
import styled from 'styled-components'

const TooltipWrapper = styled.div`
  border-radius: 4px;
  background-color: #ffffff;
  min-width: 161px;
  min-height: 73px;
  padding-left: 6px;
`
const TooltipHeader = styled.div``

const TooltipBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
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

const TooltipData = styled.span`
  font-size: 12px;
`

const formatLabel = label => label

const tooltip = (id, value, color) => (
  <TooltipWrapper>
    <TooltipHeader>
      <TooltipNode
        style={{ backgroundColor: color }}
      />
      <TooltipLabel>
        {formatLabel(id)}
      </TooltipLabel>
    </TooltipHeader>
    <TooltipBody>
      <TooltipData>
        {` Value (%) - ${value}`}
      </TooltipData>
      <TooltipData>
        {`Column - ${id}`}
      </TooltipData>
    </TooltipBody>
  </TooltipWrapper>
)

export default tooltip
