import React from 'react';
import Plot from 'react-plotly.js';

const Bar = ({ data, layout, config }) => {
    return <Plot data={data} layout={layout} config={config} /> 
};

export default Bar;