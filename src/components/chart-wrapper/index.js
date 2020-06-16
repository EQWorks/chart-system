import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import 'react-virtualized/styles.css'
import { AutoSizer } from 'react-virtualized'


const Title = styled.div`
  margin: 16px 16px 0 16px;
  height: 24px;
  font-size: 18px;
`

const ChartContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  margin: 0px 16px 16px 16px;
`

const ChartInner = styled.div`
  position: relative;
  width: ${ props => props.width}px;
  height: ${ props => props.height}px;
`

const propTypes = {
  title: PropTypes.string,
  children: PropTypes.element.isRequired,
}

const defaultProps = { title: '' }

const ChartWrapper = ({
  title,
  children,
}) => (
  <>
    {title.length && <Title>{title}</Title>}
    <ChartContainer>
      <AutoSizer>
        {({ height, width }) => (
          <ChartInner height={height} width={width}>
            {React.cloneElement(children, { height, width })}
          </ChartInner>
        )}
      </AutoSizer>
    </ChartContainer>
  </>
)

ChartWrapper.defaultProps = defaultProps
ChartWrapper.propTypes = propTypes

export default ChartWrapper
