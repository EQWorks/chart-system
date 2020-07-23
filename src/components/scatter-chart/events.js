import { DATA_HOVER_OPACITY } from '../../shared/constants/dimensions'

/**
 * onMouseEnter - defines action on mouse enter, highlighting the data set on which the cursor sets on
 * @param { HTMLElement } node - hovered node
 */
export const onMouseEnter = (event, node) => {
  const parentNode = node.target.parentNode.parentNode
  let nodeId = node.target.id
  // isolate circles from data sets that are not hovered and set their opacity
  Array.from(parentNode.children)
    // lighten all nonhovered data sets
    .forEach(ele => {
      if (ele.children[0].tagName === 'circle'
          && ele.children[0].getAttributeNode('id').value !== nodeId) {
        ele.children[0].style.opacity = DATA_HOVER_OPACITY
      }
    })
}

/**
 * onMouseLeave - defines action on mouse leave, resetting the scatter chart data points to
 * default setting (opacity: 1)
 * @param { HTMLElement } node - hovered node
 */
export const onMouseLeave = (event, node) => {
  const parentNode = node.target.parentNode.parentNode
  Array.from(parentNode.children)
    .forEach(ele => {
      if (ele.children[0].tagName === 'circle') {
        ele.children[0].style.opacity = 1
      }
    })
}
