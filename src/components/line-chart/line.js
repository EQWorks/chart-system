import React, { useState, useEffect } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'


const useStyles = makeStyles(() => ({
    tooltip: {
        width: '81px',
        height: '43px',
        borderRadius: '4px',
        boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.16)',
        backgroundColor: '#ffffff'
    },
    tooltipFont: {
        width: '62px',
        height: '34px',
        fontFamily: 'NotoSans',
        fontSize: '15px',
        fontWeight: 600,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 1.42,
        letterSpacing: '0.24px',
        textAlign: 'center',
    }
}))

const Line = ({ title, description, data, axisBottomLegend, axisLeftLegend, pointSize=0, height='500px', width='100%', ...props}) => {
    const classes = useStyles()
    const [responsiveContent, setResponsiveContent] = useState(null)
    const [color, setColor] = useState({})
    const [layers, setLayers] = useState([
        'grid',
        'markers',
        'axes',
        'areas',
        'crosshair',
        'lines',
        'points',
        'slices',
        'mesh',
        'legends'
    ])

    const customLines = ({ series, lineGenerator }) => {
        return series.map(datum => (
            <path
                key={datum.id}
                d={lineGenerator(datum.data.map(d => {
                    return {
                        x: d.position.x,
                        y: d.position.y
                    }
                }))}
                fill='none'
                stroke={datum.color}
                strokeWidth={color.serieId === datum.id ? '4px' : '2px'}
            />
        ))
    }

    const dataPointToolTip = ({ point }) => {
        return (
            <div className={classes.tooltip}>
                <p className={classes.tooltipFont}>{point.y}<br />{axisLeftLegend}</p>
            </div>
        )
    }

    const getColor = line => {
        if (line.id === color.serieId) {
            return line.color
        } else {
            return '#d4d4d4'
        }
    }

    const mouseMove = (p, _) => {
        const newLayer = [
            'grid',
            'markers',
            'axes',
            'areas',
            'crosshair',
            customLines,
            'points',
            'slices',
            'mesh',
            'legends'
        ]
        setColor(p)
        setLayers(newLayer)
    }

    const mouseLeave = () => {
        setColor({})
        setLayers([
            'grid',
            'markers',
            'axes',
            'areas',
            'crosshair',
            'lines',
            'points',
            'slices',
            'mesh',
            'legends'
        ])
    }

    useEffect(() => {
        if (width > 424) {
            setResponsiveContent('lg')
        } else if (width <= 320) {
            setResponsiveContent('sm')
        } else if (width <= 424) {
            setResponsiveContent('md')
        }
    }, [])

    return (
        <div style={{height: height, width: width, margin: '5px'}} onMouseLeave={mouseLeave}>
            <Typography gutterBottom variant="h5" component="h2">{title}</Typography>

            {responsiveContent !== 'sm' && <Typography variant="body2" color="textSecondary" component="p">{description}</Typography>}

            <ResponsiveLine
                data={data}
                enableGridX={false}
                layers={layers}
                margin={{top: 25, right: 90, bottom: 90, left: 40}}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: responsiveContent === 'lg' ? 0 : 30,
                    legend: responsiveContent === 'sm' ? null : axisBottomLegend,
                    legendOffset: 50,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: responsiveContent === 'sm' ? null : axisLeftLegend,
                    legendOffset: -45,
                    legendPosition: 'middle'
                }}
                colors={Object.keys(color).length === 0 ? {datum: 'color'} : getColor}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={pointSize}
                pointBorderColor={{ from: 'serieColor' }}
                useMesh
                enableCrosshair
                crosshairType='bottom'
                tooltip={(slice) => dataPointToolTip(slice)}
                onMouseMove={(p, e) => mouseMove(p, e)}
                legends={[
                    {
                        anchor: 'bottom-left',
                        direction: 'row',
                        translateX: 0,
                        translateY: 80,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: responsiveContent === 'sm' ? 60 : 80,
                        itemHeight: 0,
                        itemOpacity: 0.75,
                        symbolSize: responsiveContent === 'sm' ? 12 : 12,
                        symbolShape: 'circle',
                    }
                ]}
            />
        </div>
)}

export default Line