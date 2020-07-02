import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'


const TooltipWrapper = styled.div`
  border-radius: 4px;
  background-color: #ffffff;
  padding: 5px;
`

const TooltipHeader = styled.div``

const TooltipBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 14px;
`

const TooltipNode = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  background-color: ${props => props.backgroundColor}
`

const TooltipLabel = styled.strong`
  height: 17px;
  font-size: 12px;
`

const TooltipData = styled.span`
  font-size: 12px;
`

const propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  display: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired
  })),
}

const Tooltip = ({
  label,
  color,
  display,
}) => (
  <TooltipWrapper>
    <TooltipHeader>
      <TooltipNode backgroundColor={color} />
      <TooltipLabel>
        {label}
      </TooltipLabel>
    </TooltipHeader>
    <TooltipBody>
      {display.map(({ label, value }) => (
        <TooltipData key={label}>
          {label}: {value}
        </TooltipData>
      ))}
    </TooltipBody>
  </TooltipWrapper>
)

Tooltip.propTypes = propTypes

export default Tooltip
