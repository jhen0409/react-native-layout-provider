import { PropTypes } from 'prop-types'

export default {
  label: PropTypes.string.isRequired,
  viewport: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  portrait: PropTypes.bool,
}
