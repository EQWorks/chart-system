import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import AutoSizer from 'react-virtualized-auto-sizer'


const Title = styled.div`
  margin: 16px 16px 8px 16px;
  font-size: 18px;
  overflow-wrap: anywhere;
`

const ChartContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  margin: ${ props => props.title.length ? 0 : 16 }px 16px 16px 16px;
`

const ChartInner = styled.div`
  position: relative;
  width: ${ props => props.width }px;
  height: ${ props => props.height }px;
`

export const withWrapper = Chart => {
  const ChartWrapper = ({ title, ...chartProps }) => (
    <>
      {title.length !==0 && <Title>{title}</Title>}
      <ChartContainer title={title}>
        <AutoSizer>
          {({ height, width }) => (
            <ChartInner height={height} width={width}>
              <Chart
                height={height}
                width={width}
                {...chartProps}
              />
            </ChartInner>
          )}
        </AutoSizer>
      </ChartContainer>
    </>
  )
  ChartWrapper.propTypes = { title: PropTypes.string }
  ChartWrapper.defaultProps = { title: '' }
  return ChartWrapper
}
export default withWrapper // backward compat
