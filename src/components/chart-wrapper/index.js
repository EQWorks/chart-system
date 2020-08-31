import React from 'react'
import PropTypes from 'prop-types'

import { styled, setup } from 'goober'

import { ResponsiveWrapper } from '@nivo/core'


setup(React.createElement)

const Wrapper = styled('div')`
  height: 100%;
  margin: 16px 16px 16px 16px;
`

const Title = styled('div')`
  margin: 0px 16px 8px 16px;
  font-size: 18px;
  overflow-wrap: anywhere;
`

export const withWrapper = Chart => {
  const ChartWrapper = ({ title, ...chartProps }) => (
    <Wrapper chart-title={title}>
      {title.length !== 0 && <Title>{title}</Title>}
      <ResponsiveWrapper>
        {/* <AutoSizer> */}
        {({ height, width }) => (
          <Chart
            height={height - (title.length !== 0 ? 48 : 0)} // 24 + 16 + 8 is static height of title with margin
            width={width}
            {...chartProps}
          />
        )}
      </ResponsiveWrapper>
    </Wrapper>
  )
  ChartWrapper.propTypes = { title: PropTypes.string }
  ChartWrapper.defaultProps = { title: '' }
  return ChartWrapper
}
export default withWrapper
