import React from 'react';
import PieChart from '../components/PieChart';
// import { action } from '@storybook/addon-actions';
import LineChart from '../components/line-chart'
import { nivoLineData } from '../constants/data'
import ContainerExample from '../components/line-chart/container-example'


export default {
  component: [PieChart, LineChart],
  title: 'Nivo',
};

export const PieCharts = () => {
return (
<>
    <div>Small</div>
    <PieChart width={300}></PieChart>
    <div>Medium</div>
    <PieChart width={400}></PieChart>
</>
)}

export const LineCharts = () => {
  return (
    <>
      <u style={{backgroundColor: 'yellow'}}>Full Width</u>
      <LineChart data={nivoLineData} />
      <div style={{marginTop: '100px'}}>
        <u style={{backgroundColor: 'yellow'}}>With responsive contents (container example)</u>
      </div>

      <div style={{marginTop: '20px', marginBottom: '20px'}}>In <span style={{backgroundColor: 'yellow'}}>SMALL</span> container:</div>
      <ContainerExample variant='sm'><LineChart data={nivoLineData} /></ContainerExample>

      <div style={{marginTop: '70px', marginBottom: '20px'}}>In <span style={{backgroundColor: 'yellow'}}>MEDIUM</span> container:</div>
      <ContainerExample variant='md'><LineChart data={nivoLineData} /></ContainerExample>
      
      <div style={{marginTop: '150px', marginBottom: '20px'}}>In <span style={{backgroundColor: 'yellow'}}>LARGE</span> container:</div>
      <ContainerExample variant='lg'><LineChart data={nivoLineData} /></ContainerExample>
    </>
  )
}