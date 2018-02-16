import { Component, Children } from 'react'
import { PropTypes } from 'prop-types'
import { Dimensions } from 'react-native'
import shallowEqual from 'shallowequal'

const {
  width: defaultWidth,
  height: defaultHeight,
} = Dimensions.get('window')

export default class LayoutProvider extends Component {
  static propTypes = {
    label: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    portrait: PropTypes.bool,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    label: 'Default',
    width: defaultWidth,
    height: defaultHeight,
    portrait: undefined,
  }

  static childContextTypes = {
    getLayoutProviderState: PropTypes.func,
    subscribeLayout: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.getLayoutState = this.getLayoutState.bind(this)
    this.subscribeLayout = this.subscribeLayout.bind(this)
    this.setLayoutState(props)
  }

  getChildContext() {
    return {
      getLayoutProviderState: this.getLayoutState,
      subscribeLayout: this.subscribeLayout,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (shallowEqual(this.props, nextProps)) return

    this.setLayoutState(nextProps, this.update)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.state, nextState) ||
      this.props.children !== nextProps.children
  }

  setLayoutState({ label, width, height, portrait }, callback) {
    const state = {
      label,
      viewport: { width, height },
      portrait,
    }
    if (!this.state) {
      this.state = state
    } else {
      this.setState(state, callback)
    }
  }

  getLayoutState() {
    const { label, viewport: { width, height }, portrait } = this.state
    return {
      label,
      viewport: { width, height },
      portrait,
    }
  }

  subscribeLayout(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    let isSubscribed = true

    this.listeners.push(listener)

    return () => {
      if (!isSubscribed) return

      isSubscribed = false

      const index = this.listeners.indexOf(listener)
      this.listeners.splice(index, 1)
    }
  }

  update() {
    this.listeners.forEach(listener =>
      listener(this.getLayoutState())
    )
  }

  listeners = []

  render() {
    return Children.only(this.props.children)
  }
}
