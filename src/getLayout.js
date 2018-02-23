import { Component, createElement } from 'react'
import { PropTypes } from 'prop-types'
import shallowEqual from 'shallowequal'
import hoistStatics from 'hoist-non-react-statics'

const defaultMapLayoutToProps = layout => layout
const mergeProps = (contextProps, props) => ({
  ...contextProps,
  ...props,
})

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component'

export default function getLayout(mapLayoutToProps = defaultMapLayoutToProps, options = {}) {
  return WrappedComponent => {
    class GetLayout extends Component {
      static displayName = `GetLayout(${getDisplayName(WrappedComponent)})`

      static contextTypes = {
        getLayoutProviderState: PropTypes.func.isRequired,
        subscribeLayout: PropTypes.func.isRequired,
      }

      componentWillMount() {
        this.state = this.context.getLayoutProviderState()
        this.mergedProps = mergeProps(mapLayoutToProps(this.state), this.props)
        const { subscribeLayout: subscribe } = this.context
        if (!this.unsubscribe && subscribe) {
          this.unsubscribe = subscribe(state => {
            this.mergedProps = mergeProps(mapLayoutToProps(state), this.props)
            this.setState(state)
          })
        }
      }

      componentWillReceiveProps(nextProps, nextContext) {
        const { getLayoutProviderState: getState } = nextContext
        if (!this.unsubscribe && getState) {
          this.mergedProps = mergeProps(mapLayoutToProps(getState()), nextProps)
        } else {
          this.mergedProps = mergeProps(this.mergedProps, nextProps)
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps) ||
          !shallowEqual(this.state, nextState)
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe()
          this.mergedProps = null
        }
      }

      render() {
        const renderProps = options.withRef ?
          { ...this.mergedProps, ref: 'wrapInstance' } :
          this.mergedProps
        return createElement(WrappedComponent, renderProps)
      }
    }

    return hoistStatics(GetLayout, WrappedComponent)
  }
}
