import React from 'react';
import PieChart from '../components/PieChart';
// import { action } from '@storybook/addon-actions';

export default {
  component: PieChart,
  title: 'Pie Chart',
};

export const nivo = () => {
return (
<>
    <PieChart width={300}></PieChart>
    <PieChart width={400}></PieChart>
</>
)}