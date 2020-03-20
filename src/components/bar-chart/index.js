import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'


const propTypes = {
  wrapperWidth: PropTypes.number,
  wrapperHeight: PropTypes.number,
  barChartWidth: PropTypes.number,
  barChartHeight: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  groupMode: PropTypes.string,
  layout: PropTypes.string,
  padding: PropTypes.number,
  innerPadding: PropTypes.number,
  axisBottomTickRotation: PropTypes.number,
  axisLeftTickRotation: PropTypes.number,
  reverse: PropTypes.bool,
  headingTitle: PropTypes.string
}

const defaultProps = {
  wrapperWidth: '100%'
}

export default function BarChart({
  data,
  groupMode,
  layout,
  headingTitle,
  wrapperWidth,
  wrapperHeight,
  barChartWidth,
  barChartHeight,
  padding,
  innerPadding,
  reverse,
  axisBottomTickRotation,
  axisLeftTickRotation
}) {

  const wrapperStyle = {
    height: wrapperHeight,
    width: wrapperWidth,
    background: '#fff',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    margin: '1em 0'
  }

  return (
    <div style={wrapperStyle}>
      <div>{headingTitle}</div>
      <ResponsiveBar
        data={data}
        keys={['visits', 'visitors', 'repeat_visitors', 'single_visitors', 'multi_visitors']}
        indexBy='address_city'
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={padding}
        width={barChartWidth}
        height={barChartHeight}
        innerPadding={innerPadding}
        groupMode={groupMode}
        layout={layout}
        reverse={reverse}
        colors={['#0262d9', '#ef4985', '#b450c4', '#ffc908', '#28cddf']}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: axisBottomTickRotation,
          legend: 'Address City',
          legendPosition: 'middle',
          legendOffset: 40
        }}
        axisLeft={barChartWidth < 392 ? null : {
          tickSize: barChartWidth < 392 ? 2 : 5,
          tickPadding: 5,
          tickRotation: axisLeftTickRotation,
          legend: 'Amount',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        tooltip={({ id, value, color }) => (
          <>
            <strong style={{ color }}>
              {id}: {value}
            </strong>
          </>
        )}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor='transparent'
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: barChartWidth < 392 ? 140 : 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        theme={{
          tooltip: {
            container: {
              background: 'transparent'
            },
          },
          legends: {
            text: {
              ...wrapperStyle.width < 400
                ? { fontSize: 8 }
                : { ...wrapperStyle.width > 600 ? { fontSize: 12 } : { fontSize: 10 } }
            }
          },
          labels: {
            text: {
              ...wrapperStyle.width < 400
                ? { fontSize: 8 }
                : { ...wrapperStyle.width > 600 ? { fontSize: 12 } : { fontSize: 10 } }
            }
          }
        }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  )
}

BarChart.propTypes = propTypes
BarChart.defaultProps = defaultProps
