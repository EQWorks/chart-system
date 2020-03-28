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

const TooltipValue = styled.p`
  height: 17px;
  font-size: 12px;
  background-color: pink;
`

const tooltip = (slice) => (
  <TooltipWrapper>
    <TooltipValue>
      {slice.point.data.y}
    </TooltipValue>
  </TooltipWrapper>
)

export default tooltip
