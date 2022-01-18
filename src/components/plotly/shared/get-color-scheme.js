import converter from 'color-convert'
import iwanthue from 'iwanthue'

const getColorScheme = (base, colorsNeeded) => {
  const hue = converter.hex.hsl(base)[0]
  const diff = 60
  const palette = iwanthue(Math.max(colorsNeeded, 2), {
    seed: 'eqworks',
    // clustering: 'force-vector',
    clustering: 'k-means',
    colorSpace: {
      hmin: hue - diff,
      hmax: hue + diff,
      cmin: 37,
      cmax: 100,
      lmin: 40,
      lmax: 77,
    },
  })

  palette.unshift(base)
  return palette
}
export default getColorScheme
