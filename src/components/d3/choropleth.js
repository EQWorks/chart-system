import React from 'react';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

const URL = 'https://gist.githubusercontent.com/DoParkEQ/0f438074b19eea9c4c81b907065100fd/raw/120edab420fbc8b557d69335ac4c59dfc67fe828/gta.geojson'

const Choropleth = ({ width, height }) => {

  const svgRef = useRef()
  const [data, setData] = useState();
  const projection = d3.geoMercator()
    .scale(10000)
    .center([-79.2, 44])
    .translate([width / 2, height / 2])

  const path = d3.geoPath(projection)
  useEffect(() => {
    fetch(URL).then(res => res.json()).then(d => setData(d))
  }, [])
  useEffect(() => {
    if (svgRef.current && data) {
      console.log(data)
      const svg = d3.select(svgRef.current)
      const g = svg.append('g')

      g
        .selectAll('path')
        .data(data.features)
        .join('path')
        .attr('d', path)
        .attr('stroke-width', '0.5')
        .attr('stroke', 'black')
        .attr('fill', 'none')

      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {

          g.selectAll('path')
            .attr('transform', event.transform)
          // .attr('stroke-width', lineScale(event))
        })

      svg.call(zoom);
    }
  }, [svgRef.current, data])



  return (
    <svg width={width} height={height} ref={svgRef}>
    </svg>
  );
};

export default Choropleth;
