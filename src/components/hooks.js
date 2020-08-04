import { useState, useEffect } from 'react'


export const useLegendToggle = data => {
  // workaround because legend doesn't rerender when data changes
  // manually turn off then on
  const [legendToggle, setLegendToggle] = useState({})
  useEffect(() => {
    setLegendToggle({ legends: [] })
  }, [data])
  useEffect(() => {
    if (legendToggle.legends) {
      setLegendToggle({})
    }
  }, [legendToggle])

  return legendToggle
}
