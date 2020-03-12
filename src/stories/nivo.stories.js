import React from 'react'
import PieChart from '../components/PieChart'
// import { action } from '@storybook/addon-actions';

export default {
  component: PieChart,
  title: 'Nivo',
}

export const PieCharts = () => {
  return (
    <>
      <div>Small</div>
      <PieChart width={300}></PieChart>
      <div>Medium</div>
      <PieChart width={400}></PieChart>
    </>
  )}
