import React from 'react'
import PropTypes from 'prop-types'
import { typographyPropTypes, typographyDefaultProps } from '../../shared/constants/chart-props'

import { styled, setup } from 'goober'

setup(React.createElement)

// [TODO] - investigate why padding and box-shadow styles are not applied properly in all charts
const TooltipWrapper = styled('div')`
  border-radius: 4px;
  background-color: #ffffff;
  padding: ${({ charttype }) => ['line', 'scatter'].includes(charttype) ? '10px' : '2px'};
  box-shadow: ${({ charttype }) => ['line', 'scatter'].includes(charttype) ?
    '0 2px 8px 0 rgba(12, 12, 13, 0.15)' :
    "'0 2px 8px 0 rgba(12, 12, 13, 0.15)'"};
`

const TooltipHeader = styled('div')``

const TooltipBody = styled('div')`
  display: flex;
  flex-direction: column;
  margin-left: 14px;
`

const TooltipNode = styled('div')`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  background-color: ${props => props['background-color']};
`

const TooltipLabel = styled('strong')(({ typography = typographyDefaultProps.typographyProps }) =>`
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize}px;
`)

const TooltipData = styled('span')(({ typography = typographyDefaultProps.typographyProps }) =>`
font-family: ${typography.fontFamily};
font-size: ${typography.fontSize}px;
`)

const propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  display: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  })),
  disableTooltipTitle: PropTypes.bool,
  chartType: PropTypes.string.isRequired,
  typography: typographyPropTypes.typographyProps,
}

const Tooltip = ({
  label,
  color,
  display,
  disableTooltipTitle,
  chartType,
  typography,
}) => (
  <TooltipWrapper charttype={ chartType }>
    { !disableTooltipTitle && (
      <TooltipHeader>
        <TooltipNode background-color={ color } />
        <TooltipLabel
          typography={ typography }
        >
          { label }
        </TooltipLabel>
      </TooltipHeader>
    ) }
    <TooltipBody>
      {display.map(({ label, value }) => (
        <TooltipData
          key={ label }
          typography={ typography }
        >
          { label }: { value }
        </TooltipData>
      ))}
    </TooltipBody>
  </TooltipWrapper>
)

Tooltip.propTypes = propTypes
Tooltip.defaultprops = typographyDefaultProps

export default Tooltip
