import React from 'react'

import PieChart from '../components/pie-chart'

import { storiesOf } from '@storybook/react'

export default {
  title: 'Pie'
}

storiesOf('PieChart', module)
  .add('Small PieChart', () => <PieChart wrapperWidth={ 320 } wrapperHeight={ 320 } />)
  .add('Small Responsive PieChart', () => <PieChart wrapperWidth={ 400 } wrapperHeight={ 700 } />)
  .add('Small Responsive PieChart 2', () => <PieChart wrapperWidth={ 427 } wrapperHeight={ 700 } />)
  .add('Medium PieChart', () => <PieChart wrapperWidth={ 427 } wrapperHeight={ 320 } />)
  .add('Medium Responsive PieChart', () => <PieChart wrapperWidth={ 600 } wrapperHeight={ 300 } />)
  .add('Medium Responsive PieChart tall container', () => <PieChart wrapperWidth={ 450 } wrapperHeight={ 460 } />)
