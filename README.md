## Charts

A collection of chart implementations using breakpoint-based responsive designs.

Currently using:

- Nivo Charts (https://nivo.rocks/)
- Recharts (http://recharts.org/en-US/)

### Install and Run:
Run `yarn install` and `yarn start`. Open a browser at `http://localhost:9009/` to see demos of implemented charts.


### Usage

Width and height are auto-detected through `react-virtualized` AutoSizer. Currently exorting Bar, Line, Scatter and Pie from Nivo. Props:
- **data** - an array of objects with the same structure, i.e. tabular data,
- **colorType** - use design system colors through three methods and a given colorParam. Default is `palette`
  - 'palette': assign a different hue for each data series; colorParam = lightness value of 10,30,50,70 or 90
  - 'monochromatic:' assign a different lightness for each data series; colorParam = hue value of blue, color, yellow, pink, purple, teal or gray
  - 'random': assign a data series a color at random; no coloParam required
- **colorParam** - the param to configure the chosen colorType. Default is `70`
- **colors** - array of color values to use for data, overrides colorType
- **axisBottomLegendLabel** - the label for the bottom axis
- **axisBottomTrim** - whether or not to trim the bottom axis **label** values based on chart width. Default is `true`
- **axisBottomDisplayFn** - `labelValue => { ...return displayValue }` - function to customize the bottom axis tick labels. Default is `d => d`
- **axisLeftLegendLabel** - the label for the left axis
- **axisBottomDisplayFn** - `labelValue => { ...return displayValue }` - function to customize the left axis tick labels. Default is `d => d`

Bar, Line and Scatter (i.e. NOT Pie):
- **indexBy** - the key to use for grouping the data. Results in primary x-axis value in Bar Chart or data series grouping in Line or Scatter. Should NOT be included in value keys for chart. Defaults to first item of `Object.keys(data)`.
- **axisBottomOrder** - how to define the order of bottom axis labels. Either `[]` of specific values or `asc`/`desc` to sort the array


Bar Chart Only:
- **keys** - an array of keys to use as y-axis values. End up as legend items. Defaults to `Object.keys(data)` excluding the `indexBy` value.

Line and Scatter:
- **yAxisKey** - key to determine y-axis value. Defaults to second key of data.
- **xAxisKey** - key to determine x-axis value. Defaults to third key of data.

Data:
- Bar Chart data does not support duplicate entries for a single x-axis value, because only one bar is drawn. e.g. `[{ indexKey: 'test', value: 1 }, { indexKey: 'test', value: 2 }]
- Line Chart `point` x-axis does not support duplicate entries for a single x-axis value within a data series, because only one line is drawn. e.g. if 'country' indexes a data series and 'vehicle' is the `xKey` then, `[{ country: 'france', vehicle: 'plane', amount: 31 }, { country: 'france', vehicle: 'plane', amount: 1000 }]` will throw an error.
- Scatter Chart supports duplicates due to the way it is drawn. i.e. subsequent dots don't need to connect.
