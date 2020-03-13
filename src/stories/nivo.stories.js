import React from 'react'
import PieChart from '../components/PieChart'
import formattedData from '../components/PieChart/data'
// import { action } from '@storybook/addon-actions';

export default {
  component: PieChart,
  title: 'Nivo',
}

export const PieCharts = () => {
  return (
    <>
      <div>Small</div>
      <PieChart data={formattedData} width={300}></PieChart>
      <div>Medium</div>
      <PieChart data={formattedData} width={400} height={300}></PieChart>
    </>
  )}
