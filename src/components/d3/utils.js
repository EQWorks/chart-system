export const getAverage = (data) => (data.reduce((acc, val) => { return acc + val }, 0) / data.length)
