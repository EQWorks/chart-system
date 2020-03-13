import React, { useState, useReducer } from 'react'
import PropTypes from 'prop-types'
import {
  Cell,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { isNaN } from 'lodash'
import styled from 'styled-components'


const Row = styled.div`
  box-sizing: border-box;
  width: ${props => props.width || 100}%;
  padding: 5px;
  float: left;
`
const Style = {}


const propTypes = {
  chartTitle: PropTypes.object,
  chartData: PropTypes.object,
  categoryAxisTitle: PropTypes.object,
  valueAxisTitle: PropTypes.object,
  strokeDasharray: PropTypes.object,
  chartType: PropTypes.object,
  category: PropTypes.object,
  dataSets: PropTypes.object,
  exploreValue: PropTypes.bool,
  exploreCategory: PropTypes.bool,
  border: PropTypes.bool,
  shownElements: PropTypes.object,
  detailFontSize: PropTypes.object,
  layout: PropTypes.object,
  split: PropTypes.object,
  domainMin: PropTypes.object,
  domainMax: PropTypes.object,
  currentlyEditing: PropTypes.bool,
  parentPath: PropTypes.array,
}

const defaultProps = {
  chartTitle: 'Chart',
  chartData: [],
  categoryAxisTitle: '',
  valueAxisTitle: '',
  strokeDasharray: '3 3',
  chartType: 'bar',
  category: 'label',
  dataSets: [],
  exploreValue: false,
  exploreCategory: false,
  border: true,
  shownElements: {
    title: true,
    cartesianGrid: true,
    categoryAxis: true,
    categoryAxisTitle: true,
    categoryAxisDetail: true,
    tooltip: true,
    legend: true,
    valueAxis: true,
    valueAxisTitle: true,
    valueAxisDetail: true,
  },
  layout: 'vertical',
  split: false,
  detailFontSize: 14,
  domainMin: 'auto',
  domainMax: 'auto',
  widthRatio: 1,
}

const shownElementNames = Object.freeze({
  title: 'Title',
  cartesianGrid: 'Grid',
  categoryAxis: 'Category Axis',
  categoryAxisTitle: 'Category Axis Title',
  categoryAxisDetail: 'Category Axis Detail',
  valueAxis: 'Value Axis',
  valueAxisTitle: 'Value Axis Title',
  valueAxisDetail: 'Value Axis Detail',
  tooltip: 'Tooltip',
  legend: 'Legend',
  animation: 'Animation',
})

const init = state => state
const reducer = (state, { type, payload }) => {
  return {
    ...state,
    [type]: payload,
  }
}

const formatString = (label) => {
  if (typeof label === 'string') {
    return label.replace('value', '')
      .split(/[_-]/g)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }
  return label
}

const formatValue = (value) => {
  if (typeof value === 'string') {
    return value
  }
  return Math.abs(value)
}

const tooltipFormatterTemplate = (changeValue = false) =>
  (value, _, entry) =>
    [changeValue ? formatValue(value) : value, formatString(entry.dataKey)]

const legendFormatter = (label, entry) => formatString(entry.dataKey)


const Chart = ({
  shownElements,
  layout,
  split,
  dataSets,
  category,
  chartType,
  detailFontSize,
  chartData,
  chartTitle,
  categoryAxisTitle,
  valueAxisTitle,
  strokeDasharray,
  exploreValue,
  exploreCategory,
  border,
  domainMin,
  domainMax,
  // eslint-disable-next-line react/prop-types
  widthRatio,
}) => {
  const [selectedValue, setSelectedValue] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(false)
  const reducerInit = {
    shownElements,
    layout,
    split,
    dataSets,
    category,
    chartType,
    detailFontSize,
    chartData,
    chartTitle,
    categoryAxisTitle,
    valueAxisTitle,
    strokeDasharray,
    exploreValue,
    exploreCategory,
    border,
    domainMin,
    domainMax,
  }
  const [state, dispatch] = useReducer(reducer, reducerInit, init)

  // const update = (type, payload) => dispatch({ type, payload })
  // const toggleElement = (e, element) => {
  //   e.stopPropagation()
  //   const newShownElements = {
  //     ...shownElements,
  //     [element]: !shownElements[element],
  //   }
  //   update('shownElements', newShownElements)
  // }

  // const toggleSplit = (e) => {
  //   e.stopPropagation()
  //   update('split', !split)
  // }

  // const changeLayout = (e, value) => {
  //   e.stopPropagation()
  //   update('layout', value)
  // }

  // const changeType = (e, value) => {
  //   e.stopPropagation()
  //   update('chartType', value)
  // }

  // const onCategoryChange = (e, value) => {
  //   e.stopPropagation()
  //   update('category', value)
  // }

  // const addDataSet = (e) => {
  //   e.stopPropagation()
  //   const newDataSets = [...dataSets, { dataKey: '', palette: ['#374C70'] }]
  //   update('dataSets', newDataSets)
  // }

  // const removeDataSet = (e, i) => {
  //   e.stopPropagation()
  //   const newDataSets = [...dataSets.slice(0, i), ...dataSets.slice(i + 1)]
  //   update('dataSets', newDataSets)
  // }

  // const onDataSetChange = (e, i, key, value) => {
  //   e.stopPropagation()
  //   const newValue = { ...dataSets[i] }
  //   newValue[key] = value
  //   const newDataSets = [
  //     ...dataSets.slice(0, i),
  //     newValue,
  //     ...dataSets.slice(i + 1),
  //   ]
  //   update('dataSets', newDataSets)
  // }

  // const addToPallette = (color, i) => {
  //   const newValue = { ...dataSets[i] }
  //   newValue.palette = newValue.palette.concat(color.hex)
  //   const newDataSets = [
  //     ...dataSets.slice(0, i),
  //     newValue,
  //     ...dataSets.slice(i + 1),
  //   ]
  //   update('dataSets', newDataSets)
  // }

  // const removeFromPalette = (i, j) => {
  //   const newValue = { ...dataSets[i] }
  //   if (newValue.palette.length > 1) {
  //     newValue.palette = [
  //       ...newValue.palette.slice(0, j),
  //       ...newValue.palette.slice(j + 1),
  //     ]
  //     const newDataSets = [
  //       ...dataSets.slice(0, i),
  //       newValue,
  //       ...dataSets.slice(i + 1),
  //     ]
  //     update('dataSets', newDataSets)
  //   }
  // }

  if (chartData.length === 0 || !chartData[0]) {
    return <p>Configure data to display chart options</p>
  }

  const metricOptions = Object.keys(chartData[0]).map(keyName => (
    {
      text: formatString(keyName),
      value: keyName,
      key: keyName,
    }
  ))

  let barGap
  let finalData = chartData
  let tooltipFormatter = tooltipFormatterTemplate(false)

  let absAxis

  const height = 300
  const width = '100%'

  if (split) {
    let axis = height
    const adjustment = 8 / finalData.length
    let ratio = 1.92 / 3
    if (layout === 'horizontal') {
      axis = 100
      ratio = 1.79 / 3
      barGap = '-78%'
    } else {
      barGap = (-(axis * ratio) / finalData.length) + adjustment
    }
    // manual values to get "split" behavior
    // 14 = -70 // -13
    // 11 = -73
    // 10 = -75 //
    // 7 = -75 // -26
    // 6 = -77
    // 5 = -77 // -38
    // 4 = -79
    // 3 = 79.5 // -63
    // 1 = ___ // -192
    // map every other key to negative!
    finalData = finalData.map((datum) => {
      const ret = Object.assign({}, datum)
      for (let i = 0; i < dataSets.length - 1; i += 2) {
        ret[dataSets[i].dataKey] *= -1
      }
      return ret
    })

    tooltipFormatter = tooltipFormatterTemplate(true)
    absAxis = tick => Math.abs(tick)
  }

  const toggleElementControls = Object.keys(state.shownElements).map(ele => (
    <React.Fragment key={ele}>
      <input
        type='checkbox'
        id={ele}
        name={ele}
        checked={state.shownElements[ele]}
        onChange={() => dispatch({
          type: 'shownElements',
          // toggle only this state
          payload: {...state.shownElements, [ele]: !state.shownElements[ele] }
        })}
      />
      <label htmlFor={ele}>{shownElementNames[ele]}</label><br />
    </React.Fragment>
  ))

  const valueAxisLabel = state.shownElements.valueAxisTitle ? {
    value: valueAxisTitle,
    angle: -90,
    position: 'insideLeft',
  } : null
  const categoryAxisLabel = state.shownElements.categoryAxisTitle ? {
    value: categoryAxisTitle,
    offset: 0,
    position: 'insideBottom',
  } : null

  const categoryAxisTick = state.shownElements.categoryAxisDetail ?
    { fontSize: detailFontSize * widthRatio } : false
  const valueAxisTick =
    state.shownElements.valueAxisDetail ? { fontSize: detailFontSize * widthRatio } : false

  const currentCategoryOptions = metricOptions.map(option => ({
    ...option,
    disabled: Object.values(dataSets).map(o => o.dataKey).includes(option.value),
  }))

  const currentMetricOptions = metricOptions.map(option => ({
    ...option,
    disabled: option.value === category,
  }))

  const categoryKey = selectedCategory ||
    (currentCategoryOptions.map(o => o.value).includes(category) ? category : null)
  // const valueKey = selectedValue || (dataSets.length > 0 ? dataSets[0].dataKey : '')

  const categoryAxisProps = {
    hide: !state.shownElements.categoryAxis,
    label: categoryAxisLabel,
    dataKey: categoryKey,
    tick: categoryAxisTick,
    layout,
    allowDuplicatedCategory: false,
    type: 'category',
  }

  const valueAxisProps = {
    hide: !state.shownElements.valueAxis,
    tickFormatter: absAxis,
    label: valueAxisLabel,
    tick: valueAxisTick,
    layout,
    allowDuplicatedCategory: true,
    type: 'number',
    domain: [
      ['auto', 'dataMin'].includes(domainMin) ? domainMin : parseInt(domainMin),
      ['auto', 'dataMax'].includes(domainMax) ? domainMax : parseInt(domainMax),
    ],
  }

  let categoryAxis = (
    <XAxis
      {...categoryAxisProps}
    />
  )

  let valueAxis = (
    <YAxis
      {...valueAxisProps}
    />
  )

  if (layout === 'vertical') {
    if (categoryAxisLabel) {
      categoryAxisProps.label.angle = -90
      categoryAxisProps.label.position = 'insideLeft'
    }
    if (valueAxisLabel) {
      valueAxisProps.label.angle = 0
      valueAxisProps.label.position = 'insideBottom'
      valueAxisProps.label.offset = 0
    }
    categoryAxis = (
      <YAxis
        {...categoryAxisProps}
      />
    )
    valueAxis = (
      <XAxis
        {...valueAxisProps}
      />
    )
  }

  let chart
  if (state.chartType === 'bar') {
    chart = (
      <BarChart barGap={barGap} layout={layout} data={finalData}>
        {state.shownElements.cartesianGrid && (
          <CartesianGrid
            strokeDasharray={strokeDasharray}
          />
        )}
        {categoryAxis}
        {valueAxis}
        {state.shownElements.legend && <Legend formatter={legendFormatter} />}
        {state.shownElements.tooltip && <Tooltip formatter={tooltipFormatter} />}
        {dataSets.map((dataSet, i) => (
          <Bar
            key={Math.random()}
            data={finalData}
            dataKey={i === 0 ? selectedValue || dataSet.dataKey : dataSet.dataKey}
            name={dataSet.dataKey}
            fill={dataSet.palette[0]}
            isAnimationActive={state.shownElements.animation}
          >
            {
              finalData.map((d, i) => (
                <Cell
                  key={Math.random()}
                  fill={dataSet.palette[i % dataSet.palette.length]}
                />
              ))
            }
          </Bar>
        ))}
      </BarChart>
    )
  } else if (state.chartType === 'scatter') {
    chart = (
      <ScatterChart layout={layout} data={finalData}>
        {state.shownElements.cartesianGrid && (
          <CartesianGrid
            strokeDasharray={strokeDasharray}
          />
        )}
        {categoryAxis}
        {valueAxis}
        {state.shownElements.legend && <Legend />}
        {state.shownElements.tooltip && (
          <Tooltip
            cursor={{ strokeDasharray: '2 2' }}
            formatter={tooltipFormatter}
          />)
        }
        {dataSets.map((dataSet, i) => (
          <Scatter
            key={Math.random()}
            data={finalData}
            dataKey={i === 0 ? selectedValue || dataSet.dataKey : dataSet.dataKey}
            name={dataSet.dataKey}
            fill={dataSet.palette[0]}
            isAnimationActive={state.shownElements.animation}
          >
            {
              finalData.map((d, i) => (
                <Cell
                  key={Math.random()}
                  fill={dataSet.palette[i % dataSet.palette.length]}
                />
              ))
            }
          </Scatter>
        ))}
      </ScatterChart>
    )
  } else if (state.chartType === 'line') {
    chart = (
      <LineChart layout={layout} data={finalData}>
        {state.shownElements.cartesianGrid && (
          <CartesianGrid
            strokeDasharray={strokeDasharray}
          />
        )}
        {categoryAxis}
        {valueAxis}
        {state.shownElements.legend && <Legend />}
        {state.shownElements.tooltip && <Tooltip formatter={tooltipFormatter} />}
        {dataSets.map((dataSet, i) => (
          <Line
            key={Math.random()}
            data={finalData}
            dataKey={i === 0 ? selectedValue || dataSet.dataKey : dataSet.dataKey}
            name={dataSet.dataKey}
            stroke={dataSet.palette[0]}
            strokeWidth='3'
            fill={dataSet.palette[0]}
            isAnimationActive={state.shownElements.animation}
            dot={{ stroke: dataSet.palette[0], strokeWidth: 2 }}
            activeDot={{ r: 8 }}
            type='monotone'
          />
        ))}
      </LineChart>
    )
  } else if (state.chartType === 'area') {
    chart = (
      <AreaChart layout={layout} data={finalData}>
        {state.shownElements.cartesianGrid && (
          <CartesianGrid
            strokeDasharray={strokeDasharray}
          />
        )}
        {categoryAxis}
        {valueAxis}
        {state.shownElements.legend && <Legend />}
        {state.shownElements.tooltip && <Tooltip formatter={tooltipFormatter} />}
        {dataSets.map((dataSet, i) => (
          <Area
            key={Math.random()}
            data={finalData}
            dataKey={i === 0 ? selectedValue || dataSet.dataKey : dataSet.dataKey}
            name={dataSet.dataKey}
            stroke={dataSet.palette[0]}
            fill={dataSet.palette[0]}
            fillOpacity={1}
            isAnimationActive={state.shownElements.animation}
          />
        ))}
      </AreaChart>
    )
  } else {
    chart = (
      <BarChart barGap={barGap} layout={layout} data={finalData}>
        {state.shownElements.cartesianGrid && (
          <CartesianGrid
            strokeDasharray={strokeDasharray}
          />
        )}
        {categoryAxis}
        {valueAxis}
        {state.shownElements.legend && <Legend />}
        {state.shownElements.tooltip && <Tooltip formatter={tooltipFormatter} />}
        {dataSets.map((dataSet, i) => (
          <Bar
            key={Math.random()}
            dataKey={i === 0 ? selectedValue || dataSet.dataKey : dataSet.dataKey}
            name={dataSet.dataKey}
            fill={dataSet.palette[0]}
            isAnimationActive={false}
          >
            {
              finalData.map((d, i) => (
                <Cell
                  key={Math.random()}
                  fill={dataSet.palette[i % dataSet.palette.length]}
                />
              ))
            }
          </Bar>
        ))}
      </BarChart>
    )
  }

  let graphClass = `${Style.graphDiv}`
  if (border) {
    graphClass += ` ${Style.graphBorder}`
  }

  const displayControls = (
    <React.Fragment>
      <p>Chart Type</p>
      {['bar', 'scatter', 'line', 'area'].map(type => (
        <React.Fragment key={type}>
          <input
            type='radio'
            id={type}
            name='chartType'
            checked={state.chartType === type}
            onChange={() => dispatch({ type: 'chartType', payload: type})}
          />
          <label htmlFor={type}>{type}</label><br />
        </React.Fragment>
      ))}
      <p>Orientation</p>
      {['horizontal', 'vertical'].map(type => (
        <React.Fragment key={type}>
          <input
            type='radio'
            id={type}
            name='layout'
            checked={state.layout === type}
            onChange={() => dispatch({ type: 'layout', payload: type})}
          />
          <label htmlFor={type}>{type}</label><br />
        </React.Fragment>
      ))}
      <input
        type='checkbox'
        id='split'
        name='split'
        checked={state.split}
        onChange={() => dispatch({
          type: 'split',
          payload: !state.split,
        })}
      />
      <label hmtlFor='split'>Split</label>
    </React.Fragment>
  )

  const element = (
    <React.Fragment>
      {exploreValue && (
        <Row>
          <select onChange={(e) => setSelectedValue(e.target.value)}>
            {currentMetricOptions
              .filter(option => !isNaN(parseFloat(chartData[0][option.value])))
              .map(opt => <option key={opt.key} value={opt.value}>{opt.text}</option>)
            }
          </select>
        </Row>
      )}
      {exploreCategory && (
        <Row>
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            {metricOptions
              .map(opt => <option key={opt.key} value={opt.value}>{opt.text}</option>)
            }
          </select>
        </Row>
      )}
      <div className={graphClass}>
        {state.shownElements.title && <div className={Style.chartTitle}>{chartTitle}</div>}
        <ResponsiveContainer width={width} height={height}>
          {chart}
        </ResponsiveContainer>
      </div>
      <Row width={50}>
        {toggleElementControls}
      </Row>
      <Row width={50}>
        {displayControls}
      </Row>
    </React.Fragment>
  )

  // const dataControls = (
  //   <Segment raised className={Style.configWrapper}>
  //     <Label color='blue' ribbon>
  //       Data
  //     </Label>
  //     <Grid container padded>
  //       <Grid.Column width={16}>
  //         <Label style={{ marginBottom: '2px' }}>Category</Label>
  //         <Grid.Row>
  //           <Dropdown
  //             placeholder='choose category'
  //             selection
  //             search
  //             options={currentCategoryOptions}
  //             value={category}
  //             onChange={(e, { value }) => onCategoryChange(e, value)}
  //           />
  //         </Grid.Row>
  //         <Label>Values</Label>
  //         <Button
  //           as='div'
  //           icon='plus square'
  //           basic
  //           circular
  //           color='blue'
  //           disabled={dataSets.length === metricOptions.length - 1}
  //           onClick={e => addDataSet(e)}
  //         />
  //         {dataSets.map((dataSet, i) => (
  //           <React.Fragment key={`${dataSet.dataKey}`}>
  //             <Grid.Row>
  //               <Dropdown
  //                 placeholder='choose metric'
  //                 selection
  //                 search
  //                 options={currentMetricOptions}
  //                 value={dataSet.dataKey}
  //                 onChange={(e, { value }) => onDataSetChange(e, i, 'dataKey', value)}
  //               />
  //               <Popup
  //                 trigger={
  //                   <Button
  //                     circular
  //                     basic
  //                     color='blue'
  //                     icon='minus square'
  //                     onClick={e => removeDataSet(e, i)}
  //                   />
  //                 }
  //                 content='Remove Value'
  //                 position='right center'
  //                 size='tiny'
  //                 inverted
  //               />
  //             </Grid.Row>
  //             <Grid.Row>
  //               <div
  //                 style={{ display: 'inline-block' }}
  //               >
  //                 Palette{dataSet.palette.length > 1 ? ' (click to remove)' : ''}:
  //               </div>
  //               <div className={Style.paletteDiv}>
  //                 {dataSet.palette.map((color, j) => {
  //                   let clickProps = {}
  //                   if (dataSet.palette.length > 1) {
  //                     clickProps = {
  //                       role: 'button',
  //                       tabIndex: 0,
  //                       onClick: () => removeFromPalette(i, j),
  //                     }
  //                   }
  //                   return (
  //                     <div
  //                       key={Math.random()}
  //                       style={{ backgroundColor: color }}
  //                       className={Style.paletteItem}
  //                       {...clickProps}
  //                     />
  //                   )
  //                 })}
  //               </div>
  //             </Grid.Row>
  //             <SliderPicker
  //               styles={{ default: { wrap: {} } }}
  //               color='#fff'
  //               onChange={(color, e) => {
  //                 if (e.target.style.cursor === 'pointer') {
  //                   addToPallette(color, i)
  //                 }
  //               }}
  //             />
  //             <Divider />
  //           </React.Fragment>
  //         ))}
  //       </Grid.Column>
  //     </Grid>
  //   </Segment>
  // )


  return (
    <React.Fragment>
      {element}
    </React.Fragment>
  )
}

/*
<Grid>
  {!(editStyle === 'export' && currentlyEditing) && (
    <Grid.Column width={8}>
      <Segment>{element}</Segment>
    </Grid.Column>
  )}
  <Grid.Column width={8}>
    {dataControls}
  </Grid.Column>
  <Grid.Column width={16}>
    {displayControls}
  </Grid.Column>
</Grid>
*/

Chart.propTypes = propTypes
Chart.defaultProps = defaultProps

export default Chart
