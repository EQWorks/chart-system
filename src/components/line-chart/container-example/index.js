import React, { Children, cloneElement } from 'react'
import SmContainer from './sm-container'
import MdContainer from './md-container'
import LgContainer from './lg-container'


const ContainerExample = ({ variant='sm', ...props }) => {
  let width
  let height = 320 || 'auto'

  variant === 'sm' ? width = 320 : variant === 'md' ? width = 424 : variant === 'lg' ? width = 656 : width = 'auto'

  const childrenWithProps = Children.map(
    props.children,
    child => cloneElement(child, {width: width, height: height})
  )

  if (variant === 'sm') {
    return <SmContainer>{childrenWithProps}</SmContainer>
  } else if (variant === 'md') {
    return <MdContainer>{childrenWithProps}</MdContainer>
  } else if (variant === 'lg') {
    return <LgContainer>{childrenWithProps}</LgContainer>
  }
}

export default ContainerExample