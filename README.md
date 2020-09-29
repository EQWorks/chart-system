# Charts

A collection of chart implementations using breakpoint-based responsive designs.

## Import

```
import {
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
} from '@eqworks/chart-system'
```

## Usage

Width and height are auto-detected through `nivo` ResponsiveWrapper. Currently exorting functional implmentations of Bar, Line, Scatter and Pie from Nivo.

### Props
A catch-all `{...nivoProps}` is passed along to each chart, though the values might be overriden.
- **data** - an array of objects with the same structure, i.e. tabular data,
- **indexBy** - the key to use for grouping the data. Results in primary x-axis value in Bar Chart, data series grouping in Line and Scatter as well as how to define the slices in PieChart. Should NOT be included in value keys for chart. Defaults to first item of `Object.keys(data[0])`.
- **colorType** - use design system colors through three methods and a given colorParam. Default is `palette`
  - 'palette': assign a different hue for each data series; colorParam = lightness value of 10,30,50,70 or 90
  - 'monochromatic:' assign a different lightness for each data series; colorParam = hue value of blue, color, yellow, pink, purple, teal or gray
  - 'random': assign a data series a color at random; no coloParam required
- **colorParam** - the param to configure the chosen colorType. Default is `70`
- **colors** - array of color values to use for data, overrides colorType
- **axisBottomLegendLabel** - the label for the bottom axis
- **axisBottomTrim** - whether or not to trim the bottom axis **label** values based on chart width. Default is `true`
- **axisBottomLabelDisplayFn** - `labelValue => { ...return displayValue }` - function to customize the bottom axis tick labels. Default is `d => d`
- **axisLeftLegendLabel** - the label for the left axis
- **axisLeftLabelDisplayFn** - `labelValue => { ...return displayValue }` - function to customize the left axis tick labels. Default is `d => d`
- **maxRowLegendItems** - maximum labels on the bottom / row chart legend. Default is MAX_LEGEND_ITEMS_ROW (3)
- **trimLegend** - whether or not to trim chart legend labels. Default is `true`
- **disableLegend** - whether or not to display chart Legend. Default is `false`
- **tooltipFormat** - a function that exposes the final value of the tooltip for formatting. Receives the value as an argument. Default is `v => v`
- **title** - the title text in `<Title />` component. Default value is ``
- **titleStyle** - styling props for `<Title />` component. Default value is
```javascript
titleStyle: {
  color: 'black',
  fontSize: '18px',
  fontWeight: 'normal',
  textAlign: 'left'
}
```
- **typographyProps** - props object for styling chart font family, size, and color. Default values:
```javascript
typographyProps: {
    fontFamily: ' \'Open Sans\', sans-serif',
    fontSize: 12,
    textColor: 'black'
  }
```

#### Bar, Line and Scatter:
- **axisBottomOrder** - how to define the order of bottom axis labels for a Bar Chart or 'point' scale. Either `[]` of specific values or `asc`/`desc` to sort the data. If an array is provided, data will be filtered based on the provided keys. Axis scale must be set to `{ type: 'point' }`. To sort dates properly, they need to be a javascript object instead of a string.
- **axisBottomLabelValues** - what label values to show on the bottom axis. Either `[]` of specific values, a `number` of how many ticks should appear or a string describing the time interval. More details (here | https://nivo.rocks/guides/axes)
- **tooltipFormatX** - a function that exposes the final value of the tooltip for formatting the bottom axis since it could be used for dates with TimeSeries. Receives the value as an argument. Default is `v => v`

#### BarChart Only:
- **keys** - an array of keys to use as y-axis values. End up as legend items. Defaults to `Object.keys(data[0])` excluding the `indexBy` value.

#### PieChart Only:
- **dataKey**: the key to use for pie chart **values**. Defaults to second item of `Object.keys(data[0])`.
- **isDonut** - whether to include `innerRadius={0.6}` Nivo prop. Default is `false`
- **enableSlicesLabels** - to include % values in the pie chart itself. Defaults is `true`
- **slicesLabelsSkipAngle** - the angle (i.e. width) of a pie slice at which the label is not displayed. Defaults is `30`

#### Bar Only:
This charts requires a unique `indexBy` values to properly render and the following keys allow some aggregation to facilitate that. Ideally, data should be properly processed in advance.
- **groupByKey** - a key to use whose values will be transformed into keys, summing data indicated by `valueKey`.  Must be provided with a `valueKey`. Default is `''`
- **valueKey** - the value to sum across unique values of `groupByKey`. Must be provided with a `groupByKey`. Default is `''`
For example, given:

```javascript
[
  { country: 'usa', vehicle: 'car', amount: 25 },
  { country: 'usa', vehicle: 'boat', amount: 15 },
  { country: 'canada', vehicle: 'car', amount: 20 },
  { country: 'canada', vehicle: 'boat', amount: 30 },
]
```
If `indexBy = 'country'` and `keys=['amount']` then by default the data would remove the resolution of the `vehicle` key:
```javascript
[{ country: 'usa', amount: 40 }, { country: 'canada', amount: 50 }]
```
To include a **data series** for each vehicle, we can set `groupByKey='vehicle'` and `valueKey='amount'` to produce:
```javascript
[
  { country: 'usa', car: 25, boat: 15 },
  { country: 'canada', car: 20, boat: 30 },
]
```
Each unique value of the `groupByKey` is converted into a key, whose value is the sum of `valueKey`.

#### Line and Scatter Only:
- **xKey** - key to determine x-axis value. Defaults to `Object.keys(data[0])[0]` when `indexByValue` is `false`, otherwise `Object.keys(data[0])[1]`.
- **yKeys** - keys to determine y-axis value. Defaults to `Object.keys(data[0]).slice(1)` when `indexByValue` is `false`, otherwise a single element array: `[Object.keys(data[0])[2]]`.
- **indexByValue** - defines whether to generate a **data series** based on the _value_ of `indexBy` or the _actual keys_. Default is `true`.
- **indexBy** - key to determine which value to aggregate data by. Required when using `indexByValue`. Defaults to `Object.keys(data[0])[0]`.
- **xScale** - object to configure the x-axis scale. (Nivo Docs | https://github.com/plouc/nivo/blob/f967380e2900d893f5174c5070743a9b4dffa9ec/packages/scales/src/compute.js#L25). Configuration parameters (such as **min**/**max** values) are not well documented, but are implemented (here | https://github.com/plouc/nivo/tree/f967380e2900d893f5174c5070743a9b4dffa9ec/packages/scales/src).
- **yScale** - object to configure the y-axis scale.
```
{
  type: 'point' (default) | 'linear' | 'log' | 'time'
  ...configuration parameters
}
```
For example:
- basic numeric axis
```
xScale={{
  type: 'linear',
  min: 0,
  max: 'auto',
}}
```
- logarithmic axis
```
xScale={{
  type: 'log',
  base: 2,
  max: 'auto',
}}
```
- time axis
```
xScale={{
  type: 'time',
  format: '%Y-%m-%d',
  useUTC: false,
  precision: 'day',
}}
```

### Data Processing
- Bar Chart data does not support duplicate entries for a single x-axis value, because only one bar is drawn. e.g. `[{ indexKey: 'test', value: 1 }, { indexKey: 'test', value: 2 }]. Data is aggregated by default.
- Line Chart `point` x-axis does not support duplicate entries for a single x-axis value within a data series, because only one line is drawn. e.g. if 'country' indexes a data series and 'vehicle' is the `xKey` then, `[{ country: 'france', vehicle: 'plane', amount: 31 }, { country: 'france', vehicle: 'plane', amount: 1000 }]` will throw an error.
- Scatter Chart supports duplicates due to the way it is drawn. i.e. subsequent dots don't need to connect.
- Pie Chart does not support duplicate entries for its `indexBy` value. Data is aggregated by default.
- If the key used in `indexBy` (or `groupByKey` for bar) has only numbers - even if it is in a string format like `'123'` - the order of the data cannot be guaranteed to be the same as original, which could affect the order of the legend and color assignment.

### Development:
Run `yarn install` and `yarn start`. Open a browser at `http://localhost:9009/` to see demos of implemented charts.