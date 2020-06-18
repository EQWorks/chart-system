import React from 'react'
import PropTypes from 'prop-types'
import ChartWrapper from '../chart-wrapper'
import Chart from './chart'


const propTypes = { title: PropTypes.string }
const defaultProps = { title: '' }

const ResponsiveChart = ({ title, ...chartProps }) => (
  <ChartWrapper title={title}>
    <Chart {...chartProps} />
  </ChartWrapper>
)

ResponsiveChart.propTypes = propTypes
ResponsiveChart.defaultProps = defaultProps

export default ResponsiveChart
