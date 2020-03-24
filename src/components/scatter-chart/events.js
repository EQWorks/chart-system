/**
 * onMouseEnter - defines action on mouse enter, highlighting the data set on which the cursor sets on
 * @param { object } data - data object
 * @param { object } event - event object
 */
export const onMouseEnter = (data, event) => {
  const parentNode = event.target.parentNode
  // lastChild contains legend circles for which we don't want to change opacity
  const lastChildCircles = parentNode.lastChild.getElementsByTagName('circle')
  if (event.target.tagName === 'circle') {
    let selectedPointColor = event.target.getAttributeNode('fill').value
    // gather all the circles in the parent node
    let dataPoints = Array.from(parentNode.getElementsByTagName('circle'))
    const nrCirclesToRemove = lastChildCircles.length
    const nrCirclesTotal= dataPoints.length
    // remove the legend circles so we don't change their style
    dataPoints.splice(nrCirclesTotal-nrCirclesToRemove, nrCirclesToRemove)
    dataPoints.forEach( point => {
      if (point.getAttributeNode('fill').value !== selectedPointColor) {
        point.style.opacity = 0.1
      }
    })
  }
}

/**
 * onMouseLeave - defines action on mouse leave, resetting the scatter charts to default setting
 * @param { object } data - data object
 * @param { object } event - event object
 */
export const onMouseLeave = (data, event) => {
  const parentNode = event.target.parentNode
  const dataPoints = parentNode.getElementsByTagName('circle')
  for (let i = 0; i < dataPoints.length; i++ ) {
    dataPoints[i].style.opacity = 1
  }
}
