import React from 'react'
import { View } from 'react-native'
import { mount } from 'enzyme'
import LayoutProvider from '../src/LayoutProvider'
import getLayout from '../src/getLayout'
import defaultLayoutTypes from '../src/defaultLayoutTypes'
import expect from 'expect'
import spyLifeCycle from 'spy-react-component-lifecycle'

const defaultState = {
  label: 'Default',
  viewport: {
    width: 320,
    height: 768,
  },
  portrait: undefined,
}

const TestComponent = () =>
  <View />

TestComponent.propTypes = defaultLayoutTypes

describe('Wrap component with getLayout decorator', () => {
  it('should get right props on Component', () => {
    const layoutWrapper = mount(
      <LayoutProvider>
        <View />
      </LayoutProvider>
    )
    const layoutInstance = layoutWrapper.instance()
    const Wrap = getLayout(layout => layout)(TestComponent)
    const wrapper = mount(<Wrap a={1} />, {
      context: {
        getLayoutProviderState: layoutInstance.getLayoutState,
        subscribeLayout: layoutInstance.subscribeLayout,
      },
    })
    expect(wrapper.state()).toEqual(defaultState)
    expect(
      wrapper.find(TestComponent).props()
    ).toEqual({
      ...defaultState,
      a: 1,
    })
  })

  it('should update if LayoutProvider props changed', () => {
    const layoutWrapper = mount(
      <LayoutProvider>
        <View />
      </LayoutProvider>
    )
    const Wrap = getLayout(layout => layout)(TestComponent)
    spyLifeCycle(Wrap)

    const layoutInstance = layoutWrapper.instance()
    const wrapper = mount(<Wrap a={1} />, {
      context: {
        getLayoutProviderState: layoutInstance.getLayoutState,
        subscribeLayout: layoutInstance.subscribeLayout,
      },
    })
    expect(wrapper.instance().mergedProps).toEqual({
      ...defaultState,
      a: 1,
    })
    expect(Wrap.prototype.render.callCount).toBe(1)

    layoutWrapper.setProps({
      label: 'iPhone6',
      height: 100,
      portrait: false,
    })
    expect(wrapper.instance().mergedProps).toEqual({
      ...defaultState,
      a: 1,
      label: 'iPhone6',
      viewport: {
        ...defaultState.viewport,
        height: 100,
      },
      portrait: false,
    })
    expect(Wrap.prototype.render.callCount).toBe(2)
  })
})
