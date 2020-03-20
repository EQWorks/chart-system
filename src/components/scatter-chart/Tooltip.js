import React from 'react'
import styled from 'styled-components'

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
const TooltipData = styled.div`
  font-size: 12px;
  margin-left: 2px;
`
const TooltipWrapper = styled.div`
  border-radius: 4px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  width: 99px;
  height: 63px;
  text-align: center;
`
/**
 * formatLabel - removes the part of string after '.'
 * @param { string } label - a string variable
 * @return { string } - the first part of the string, up the '.'
 */
const formatLabel = (label) => {
  let index = label.indexOf('.')
  return label.substring(0, index)
}

// tooltip - creates tooltip component used in scatter charts
const tooltip = (node) => (
  <TooltipWrapper>
    <TooltipNode
      style={{ backgroundColor: node.style.color }}
    />
    <TooltipLabel>
      { formatLabel(node.id)}
    </TooltipLabel>
    <br />
    <TooltipData>
      { `x-axis: ${ node.data.formattedX }` }
    </TooltipData>
    <TooltipData>
      { `y-axis: ${ node.data.formattedY }` }
    </TooltipData>
  </TooltipWrapper>
)

export default tooltip
