import React from 'react'
import styled from 'styled-components'

const TooltipWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 99px;
  min-height: 63px;
`

const TooltipValue = styled.strong`
  height: 17px;
  font-size: 12px;
`
const ToolTipTitle = styled.div`
  height: 17px;
  margin-left: 2px;
`

const tooltip = (id, value) => (
  <TooltipWrapper>
    <TooltipValue>
      {value}
    </TooltipValue>
    <ToolTipTitle>
      {id}
    </ToolTipTitle>
  </TooltipWrapper>
)

export default tooltip
