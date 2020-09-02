import React, { createRef, forwardRef } from 'react'

import { titlePropTypes, titleDefaultProps } from '../../shared/constants/title-props'
import { typographyPropTypes, typographyDefaultProps } from '../../shared/constants/chart-props'

import { styled, setup } from 'goober'

import { ResponsiveWrapper } from '@nivo/core'


setup(React.createElement)

const Wrapper = styled('div')`
  height: 100%;
  margin: 16px;
`

const Title = styled('div', forwardRef)`
  margin-bottom: 16px;
  overflow-wrap: anywhere;
`

export const withWrapper = Chart => {
  const ChartWrapper = ({
    title,
    titleStyle,
    typographyProps,
    ...chartProps
  }) => {
    const titleRef = createRef(null)
    return (
      <Wrapper>
        { title.length !== 0 &&
        <Title
          ref={ titleRef }
          style={{
            fontFamily: typographyProps.fontFamily,
            ...titleStyle
          }}
        >
          { title }
        </Title> }
        <ResponsiveWrapper>
          {({ height, width }) =>
            <Chart
              /**
               * because we have 16px margin and height 100% for Wrapper, the height overflows the container with 32px
               * for chart we have to substract the top and bottom Wrapper margins plus the bottom title margin (16px)
               */
              height={ height - (title.length !== 0
                ? titleRef.current.getBoundingClientRect().height + 32 + 16
                : 32)
              }
              width={ width }
              typographyProps={ typographyProps }
              { ...chartProps }
            />
          }
        </ResponsiveWrapper>
      </Wrapper>
    )
  }
  ChartWrapper.propTypes = { ...titlePropTypes, ...typographyPropTypes }
  ChartWrapper.defaultProps = { ...titleDefaultProps, ...typographyDefaultProps }
  return ChartWrapper
}
export default withWrapper
