import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import { ResponsiveWrapper } from '@nivo/core'


setup(React.createElement)

const Wrapper = styled('div')`
  display: flex;
  height: 100%;
  flex-direction: column;
  margin: ${props => props['chart-title'].length ? 0 : 16}px 16px 16px 16px;
`

const Title = styled('div')`
  margin: 16px 16px 8px 16px;
  font-size: 18px;
  overflow-wrap: anywhere;
`

const ChartInner = styled('div')`
  position: relative;
  width: ${ props => props.width }px;
  height: ${ props => props.height }px;
`

export const withWrapper = Chart => {
  const ChartWrapper = ({ title, ...chartProps }) => (
    <Wrapper chart-title={title}>
      {title.length !==0 && <Title>{title}</Title>}
      <ResponsiveWrapper>
        {/* <AutoSizer> */}
        {({ height, width }) => (
          // THIS "height - 16" fixes bottom margin, but don't understand know how it works
          // whithout it the bottom margin doesn't seem to adjust
          <ChartInner height={height - 16} width={width}>
            <Chart
              height={height}
              width={width}
              {...chartProps}
            />
          </ChartInner>
        )}
      </ResponsiveWrapper>
    </Wrapper>
  )
  ChartWrapper.propTypes = { title: PropTypes.string }
  ChartWrapper.defaultProps = { title: '' }
  return ChartWrapper
}
export default withWrapper
