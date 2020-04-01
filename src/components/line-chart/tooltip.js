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

// styles for various tooltip components
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

const tooltip = (slice) => {
  return (
    <>
      <TooltipWrapper>
        <TooltipHeader>
          <TooltipNode
            style={{ backgroundColor: slice.point.borderColor }}
          />
          <TooltipLabel>
            {formatLabel(slice.point.serieId)}
          </TooltipLabel>
        </TooltipHeader>
        <TooltipBody>
          <TooltipData>
            {` X Axis Metric Value - ${slice.point.data.x}`}
          </TooltipData>
          <TooltipData>
            {` Y Axis Metric Value - ${slice.point.data.y}`}
          </TooltipData>
        </TooltipBody>
      </TooltipWrapper>
    </>
  )
}

export default tooltip
