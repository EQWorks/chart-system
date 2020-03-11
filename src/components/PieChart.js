import React from 'react'

// import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'
// import numeral from 'numeral'



// const propTypes = {
//   data: PropTypes.arrayOf(PropTypes.object).isRequired,
//   selectedDataType: PropTypes.string.isRequired,
//   fieldConfig: PropTypes.arrayOf(PropTypes.shape({
//     key: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     format: PropTypes.string,
//   })).isRequired,
// }

const PieChart = ({ width, data, selectedDataType, fieldConfig }) => {
  // make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.


//   const formattedData = formatData(data, selectedDataType)
//   console.log(formattedData)

//FUTURE DATA FROM LOCUS - uncomment lines 31-57
// let d = {
//     "Totals": {
//         "visits": 7782,
//         "visitors": 3525,
//         "repeat_visitors": 1695,
//         "single_visitors": 3243,
//         "multi_visitors": 282,
//         "repeat_visitor_rate": 0.460430967943783,
//         "multi_visitor_rate": 0.0792857567675623
//  }
// }
  
// const parseData = (obj) => {
//     let data = obj.Totals
//     let finalData = []
//     for (let visit in data){
//         let element = {
//             id: visit,
//             label: visit.length > 10 ? `${visit.slice(0,10)}...` : visit,
//             value: data[visit]
//         }
//         finalData.push(element)
//     }
//     return finalData
// }

// const formattedData = parseData(d)

//DATA FROM RANDOM EXAMPLE
const formattedData = [
    {
      "id": "erlang",
      "label": "erlang",
      "value": 461,
      "color": "#0039ac"
    },
    {
      "id": "elixir",
      "label": "elixir",
      "value": 300,
      "color": "#0084ff"
    },
    {
      "id": "css",
      "label": "css",
      "value": 66,
      "color": "#e6f0ff"
    },
    {
      "id": "scala",
      "label": "scala",
      "value": 135,
      "color": "#9ac4fb"
    },
    {
      "id": "stylus",
      "label": "stylus",
      "value": 387,
      "color": "#0062d9"
    },
  ]

  
 function percentData(){
    let sum = 0

    for (let d of formattedData){
        sum = sum + d.value
    } 
    formattedData.forEach(arc => {
        arc.percent = `${(arc.value * 100 /sum).toFixed(2)}%`
    })
    return sum
  }
  percentData()
//   console.log(formattedData)

  const style = {
      height: 300,
      width: width,
      // backgroundColor: 'lightGrey'
  }

  const legend = {
    legends: [
        {
          anchor: 'right',
          direction: 'column',
          translateY: 0,
          translateX: 20,
          itemWidth: 0,
          itemHeight: 22,
          itemTextColor: '#999',
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
            //   style: { itemTextColor: 'color' },
              style: { itemTextColor: '#000' },
            },
          ],
        }
      ]
  }
  
  
  const arcLabel = e => 
     (<>
      <tspan x="0" y="0">{e.percent}</tspan>
      <tspan x="0" y="15">{e.label} </tspan>
      </>
     )


  return (
    <div style={style}>
      <ResponsivePie
        data={formattedData}
        margin={{ top: 36, right: 36, bottom: 36, left:36}}
        {...style.width >= 400 && {margin: {top: 36, right: 120, bottom: 36, left:36}}}
        sortByValue
        padAngle={0.7}
        cornerRadius={3}
        //---------------
        //FROM https://github.com/plouc/nivo/issues/477
        colors={['#0039ac', '#0084ff', '#e6f0ff', '#9ac4fb','#0062d9']}
        // colors={{ scheme: 'blues' }}
        // colors={d => d.color}
        //---------------
        borderWidth={2}
        borderColor={{ from: 'color', modifiers: [['darker', '0.3']] }}
        enableRadialLabels={false}
        // {...style.width <= 300 ? {radialLabelsSkipAngle:20} : {radialLabelsSkipAngle:10}}
        // radialLabelsTextXOffset={4}
        // radialLabelsTextColor={{ from: 'color' }}
        // radialLabelsTextColor='#333333'
        // radialLabelsLinkOffset={0}
        // radialLabelsLinkDiagonalLength={10}
        // radialLabelsLinkHorizontalLength={24}
        // radialLabelsLinkStrokeWidth={1}
        // radialLabelsLinkColor={{ from: 'color' }}
        {...style.width <= 300 ? {sliceLabel: arcLabel} : {sliceLabel: 'percent'} }
        {...style.height <= 300 ? {slicesLabelsSkipAngle:20} : {slicesLabelsSkipAngle:10}}
        slicesLabelsTextColor='white'
        // slicesLabelsTextColor='#333333'
        animate
        motionStiffness={90}
        motionDamping={15}
        tooltip={(e) => 
            <>
            <span> {e.id}: </span>
            <strong>{e.value} </strong>
            </>
        }

        {...style.width >= 400 && legend }

        //TO CHANGE FONT SIZE OF THE LEGEND BUT NOT THE PIE
        // theme={{
        //     legends: {
        //         text: {
        //             fontSize: 14,
        //         }
        //     }
        // }}

        //FROM https://github.com/plouc/nivo/issues/295 & https://github.com/plouc/nivo/issues/724
        onMouseEnter={(_data, event) => {
          console.log(_data)
          console.log(event.target)
          // formattedData.forEach(d => {
            // console.log(d.color)
            // if (d.color !== _data.color) {
              //fill all other arcs with grey
              // ?.style.fill = 'grey'
          //   }
          // })
          // console.log(formattedData)


          // event.target.style.fill = 'black';
          // event.target.style.fill = '#9EE1CE';
          // event.target.style.cursor = 'pointer'
          // event.target.style.strokeWidth = '2'
          event.target.style.opacity = '0.2'
          }}
        onMouseLeave={(_data, event) => {
            // event.target.style.fill = "";
            event.target.style.cursor = 'auto'
            // event.currentTarget.style.strokeWidth = '' + borderWidth
            event.target.style.opacity = '1'
          }}
      />
    </div>
  )
}

// PieChartNivo.propTypes = propTypes
export default PieChart
