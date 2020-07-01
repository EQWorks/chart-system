import { processColors } from '../../src/shared/utils'
import designSystemColors, { hues, lightness } from '../../src/shared/constants/design-system-colors'


describe('Color Processing', () => {
  it('should return random colors', () =>{
    const num = 5
    const colors = processColors(num, 'random')
    expect(colors.length).toEqual(num)
    expect(Object.values(designSystemColors).includes(colors[0])).toBe(true)
  })
  it('should return monochromatic colors', () =>{
    const num = 4
    const hue = hues[0]
    const colors = processColors(num, 'monochromatic', hue)
    expect(colors.length).toEqual(num)
    lightness.slice(0, num).forEach((l, i) => {
      expect(colors[i]).toBe(designSystemColors[hue+l])
    })
  })
  it('should default to blue for monochromatic', () =>{
    const num = 4
    const colors = processColors(num, 'monochromatic')
    expect(colors.length).toEqual(num)
    lightness.slice(0, num).forEach((l, i) => {
      expect(colors[i]).toBe(designSystemColors['blue'+l])
    })
  })
  it('should return palette colors', () =>{
    const num = 4
    const lightness = '10'
    const colors = processColors(num, 'palette', lightness)
    expect(colors.length).toEqual(num)
    hues.slice(0, num).forEach((h, i) => {
      expect(colors[i]).toBe(designSystemColors[h+lightness])
    })
  })
  it('should default to 30 for palette', () =>{
    const num = 4
    const colors = processColors(num, 'palette')
    expect(colors.length).toEqual(num)
    hues.slice(0, num).forEach((h, i) => {
      expect(colors[i]).toBe(designSystemColors[h+'30'])
    })
  })
})
