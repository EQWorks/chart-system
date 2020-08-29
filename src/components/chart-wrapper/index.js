import React, { createRef, forwardRef } from 'react'

import { titlePropTypes, titleDefaultProps } from '../../shared/constants/title-props'

import { styled, setup } from 'goober'

import { ResponsiveWrapper } from '@nivo/core'


setup(React.createElement)

const Wrapper = styled('div')`
  height: 100%;
  margin: 16px 16px 16px 16px;
`

const Title = styled('div', forwardRef)(
  (props) => `
    margin: 0px 16px 8px 16px;
    overflow-wrap: anywhere;
    color: ${ props['title-props'].color };
    font-size: ${ props['title-props'].fontSize };
    font-weight: ${ props['title-props'].fontWeight };
    text-align: ${ props['title-props'].textAlign };
  `
)

export const withWrapper = Chart => {
  const ChartWrapper = ({ titleProps, ...chartProps }) => {
    const titleRef = createRef(null)
    return (<Wrapper>
      {titleProps.title.length !== 0 &&
      <Title
        ref={ titleRef }
        title-props={ titleProps }
      >
        {titleProps.title}
      </Title>}
      <ResponsiveWrapper>
        {({ height, width }) =>
          <Chart
            /**
             * we substract from chart height the title div height and its top and bottom margins (16 + 8 = 24)
             * plus a bit more (8) to adjust bottom chart margin
             */
            height={ height - ( titleProps.title.length !== 0
              ? titleRef.current.getBoundingClientRect().height + 24 + 8
              : 24)
            }
            width={ width }
            { ...chartProps }
          />
        }
      </ResponsiveWrapper>
    </Wrapper>)
  }
  ChartWrapper.propTypes = titlePropTypes
  ChartWrapper.defaultProps = titleDefaultProps
  return ChartWrapper
}
export default withWrapper
