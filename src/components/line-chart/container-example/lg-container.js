import React from 'react'
import { Grid } from '@material-ui/core'


const LgContainer = props => {
  return (
    <div style={{width: '656px', height: 'auto'}}>
      <Grid container spacing={2} style={{border: '1px red solid', width: '100%', height: '100%'}}>{props.children}</Grid>
    </div>
  )
}

export default LgContainer