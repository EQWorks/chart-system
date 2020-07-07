import React from 'react'

import styled from 'styled-components'

import 'react-virtualized/styles.css'
import { AutoSizer } from 'react-virtualized'


const Title = styled.div`
  margin: 16px 16px 8px 16px;
  font-size: 18px;
  overflow-wrap: anywhere;
`

const ChartContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  margin: ${ props => props.title.length ? 0 : 16 }px 16px 16px 16px;
`

const ChartInner = styled.div`
  position: relative;
  width: ${ props => props.width }px;
  height: ${ props => props.height }px;
`

// TODO export each chart with this already in index.js
const ChartWrapper = Chart => ({
  // NOTE: default prop is not supplied at this stage
  title = '',
  ...chartProps
}) => (
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

export default ChartWrapper
