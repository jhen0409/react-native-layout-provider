import React from 'react'
import { View } from 'react-native'
import { mount } from 'enzyme'
import LayoutProvider from '../src/LayoutProvider'
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

describe('<LayoutProvider />', () => {
  beforeEach(() => {
    spyLifeCycle(LayoutProvider)
  })

  it('should render successful', () => {
    const wrapper = mount(
      <LayoutProvider>
        <View />
      </LayoutProvider>
    )
    expect(wrapper.state()).toEqual(defaultState)
    expect(wrapper.find(View).type().displayName).toBe('View')
  })

  it('should change state with set new props', () => {
    const wrapper = mount(
      <LayoutProvider>
        <View />
      </LayoutProvider>
    )
    expect(wrapper.state()).toEqual(defaultState)
    wrapper.setProps({
      portrait: true,
    })
    expect(wrapper.state()).toEqual({
      ...defaultState,
      portrait: true,
    })
    const { componentWillReceiveProps } = LayoutProvider.prototype
    expect(
      componentWillReceiveProps.calledOnce
    ).toBe(true)
  })

  it('should not re-render with set the same props', () => {
    const wrapper = mount(
      <LayoutProvider>
        <View />
      </LayoutProvider>
    )
    expect(wrapper.state()).toEqual(defaultState)

    const { render } = LayoutProvider.prototype
    expect(render.callCount).toBe(1)

    wrapper.setProps({
      portrait: undefined,
    })
    expect(render.callCount).toBe(1)
  })
})
