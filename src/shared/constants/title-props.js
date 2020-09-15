import PropTypes from 'prop-types'

export const titlePropTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.shape({
    color: PropTypes.string.isRequired,
    fontSize: PropTypes.string.isRequired,
    fontWeight: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    textAlign: PropTypes.string.isRequired,
  }),
}

export const titleDefaultProps = {
  title: '',
  titleStyle: {
    color: 'black',
    fontSize: '18px',
    fontWeight: 'normal',
    textAlign: 'left',
  },
}
