/**
 * onlyNumbers - checks if every elements inside the array are integer numbers
 * @param { array } array - array of numbers
 * @returns { boolean } - return true if the array contains only integers, false otherwise
 */
export const onlyNumbers = (array) => {
  return array.every(el => {
    return typeof el === 'number'
  })
}

/**
 * getRoundToNumberDigit - rounds a number up to the next largest integer based of the length of its digits
 * @param { numeric } num - numeric key param
 * @returns { numeric } - return the rounded up number
 */
export const getRoundToNumberDigit = (num) => {
  let roundTo = 1
  const arrayOfZero = [...Array(Math.round(num).toString().length - 1).fill('0')]
  arrayOfZero.forEach(val => { roundTo = Number(roundTo) + val})

  // to prevent getting doubled the space view in the graph for values less than one half
  if (Number((num / roundTo).toFixed(1)) < 1.5) {
    return Math.round((Number((num / roundTo).toFixed(1)) + .1) * roundTo)
  }

  return Math.ceil(num / roundTo) * roundTo
}
