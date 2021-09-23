import React from 'react'
import PropTypes from 'prop-types'
// import DataFrame from 'dataframe-js'
import * as dfd from 'danfojs/src/index'


const withDataFrame = WrappedComponent => {

  class Wrapped extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        df: this.updateDataFrame(),
      }
    }

    componentDidUpdate(prevProps) {
      const { data, filters } = this.props
      if (data !== prevProps.data || filters !== prevProps.filters) {
        this.setState({ df: this.updateDataFrame() })
      }
    }

    updateDataFrame = () => (
      Object.keys(this.props.filters).length ?
        Object.entries(this.props.filters).filter(obj => obj[1] && obj[1].length == 2)
          .reduce((acc, [key, [min, max]]) => (
            acc.query({
              'column': key,
              'is': '>=',
              'to': min,
            }).query({
              'column': key,
              'is': '<=',
              'to': max,
            })
          ), new dfd.DataFrame(this.props.data))
        :
        new dfd.DataFrame(this.props.data)
    )

    render() {
      return (
        <WrappedComponent
          df={this.state.df}
          {...this.props}
        />
      )
    }
  }
  Wrapped.propTypes = {
    data: PropTypes.array,
    filters: PropTypes.object,
  }
  Wrapped.displayName = `withDataFrame(${WrappedComponent.displayName ?? WrappedComponent.name})`
  return Wrapped
}

export default withDataFrame
