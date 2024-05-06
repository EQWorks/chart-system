import React from 'react'
import DoubleLine from '../../src/components/plotly/double-line'

import locusData from '../data/plotly/locus-double-line.json'
import mockData from '../data/plotly/mock-data-double-line.json'
import ResponsiveChartWrapper from '../shared/responsive-chart-wrapper'

export default {
  title: 'Plotly/double-line',
}

const Template = (args) =>
  <ResponsiveChartWrapper>
    <DoubleLine
      data={mockData}
      x='city'
      y={['spend', 'transactions']}
      {...args}
    />
  </ResponsiveChartWrapper>

export const Default = Template.bind({})
Default.args = { tickSuffix: ['%', '%'] }

export const CustomAxisTitles = Template.bind({})
CustomAxisTitles.args = {
  axisTitles: { x: 'Canadian City', y: 'Dollar Spend (%)', y2: 'Transactions (%)' },
  tickSuffix: ['%', '%'],
}

export const ColumnNameAliases = Template.bind({})
ColumnNameAliases.args = {
  columnNameAliases: { city: 'New City', spend: 'Spend (%)', transactions: 'Transactions (%)' },
}

export const LocusAggregate = () => {
  let totalTransactions = 0
  let totalSpent = 0
  const newData = []

  locusData.forEach(transaction => {
    totalTransactions += transaction.paymi_transactions_total_no_of_transactions
    totalSpent += transaction.paymi_transactions_total_dollars_spent
  })

  locusData.forEach(transaction => {
    const percentageOfTotalTransactions = (transaction.paymi_transactions_total_no_of_transactions / totalTransactions) * 100
    const percentageOfTotalSpent = (transaction.paymi_transactions_total_dollars_spent / totalSpent) * 100

    // Replace original values with percent values
    newData.push({
      'paymi_transactions_days_in_date': transaction.paymi_transactions_days_in_date,
      'paymi_transactions_total_dollars_spent': percentageOfTotalSpent.toFixed(2),
      'paymi_transactions_total_no_of_transactions': percentageOfTotalTransactions.toFixed(2),
    })
  })

  return (
    <ResponsiveChartWrapper>
      <DoubleLine
        data={newData}
        x='paymi_transactions_days_in_date'
        y={['paymi_transactions_total_dollars_spent', 'paymi_transactions_total_no_of_transactions']}
        customColors={{ 
          color1: ['#0066a4', '#b7b7b7'], 
        }}
        tickSuffix={['%', '%']}
        showAxisTitles={{ x: false, y: true, y2: true }}
        axisTitles={{ y: 'Dollar Spend (%)', y2: 'Transactions (%)' }}
        columnNameAliases={{ 'paymi_transactions_total_dollars_spent': 'Spend (%)', 'paymi_transactions_total_no_of_transactions': 'Transactions (%)' }}
      />
    </ResponsiveChartWrapper>
  )
}
