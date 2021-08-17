import { processColors } from '../../src/components/nivo/shared/utils'
import designSystemColors, { hues, lightnesses } from '../../src/constants/design-system-colors'


describe('Color Processing', () => {
  it('should default to palette', () =>{
    const num = 5
    const colors = processColors(num)
    expect(colors.length).toEqual(num)
    expect(colors[0]).toBe(designSystemColors[hues[0]+'30'])
    expect(colors[1]).toBe(designSystemColors[hues[1]+'30'])
  })
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
    lightnesses.slice(0, num).forEach((l, i) => {
      expect(colors[i]).toBe(designSystemColors[hue+l])
    })
  })
  it('should default to blue for monochromatic', () =>{
    const num = 4
    const colors = processColors(num, 'monochromatic')
    expect(colors.length).toEqual(num)
    lightnesses.slice(0, num).forEach((l, i) => {
      expect(colors[i]).toBe(designSystemColors['blue'+l])
    })
  })
  it('should default to blue for invalid hue for monochromatic', () =>{
    const num = 4
    const colors = processColors(num, 'monochromatic', 'orange')
    expect(colors.length).toEqual(num)
    lightnesses.slice(0, num).forEach((l, i) => {
      expect(colors[i]).toBe(designSystemColors['blue'+l])
    })
  })
  it('should fill with repeated monochromatic colors', () =>{
    const num = 8
    const hue = hues[0]
    const colors = processColors(num, 'monochromatic', hue)
    expect(colors.length).toEqual(num)
    lightnesses.slice(0, num - lightnesses.length).forEach((l, i) => {
      expect(colors[i + lightnesses.length]).toBe(designSystemColors[hue+l])
    })
  })
  it('should return palette colors', () =>{
    const num = 4
    const lightness = lightnesses[0]
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
  it('should default to 30 for invalid lightnesses for palette', () =>{
    const num = 4
    const colors = processColors(num, 'palette', 1000)
    expect(colors.length).toEqual(num)
    hues.slice(0, num).forEach((h, i) => {
      expect(colors[i]).toBe(designSystemColors[h+'30'])
    })
  })
  it('should fill with repeated palette colors', () =>{
    const num = 10
    const lightness = lightnesses[0]
    const colors = processColors(num, 'palette', lightness)
    expect(colors.length).toEqual(num)
    hues.slice(0, num - hues.length).forEach((h, i) => {
      expect(colors[i + hues.length]).toBe(designSystemColors[h+lightness])
    })
  })
})
