# React Native Layout Provider [![Build Status](https://travis-ci.org/jhen0409/react-native-layout-provider.svg?branch=master)](https://travis-ci.org/jhen0409/react-native-layout-provider)

Getting layout size by top provider instead of `Dimensions`. This is split from [react-native-layout-tester](https://github.com/machadogj/react-native-layout-tester)'s context & `getLayout` decorator. Inspired by Provider / connect of [react-redux](https://github.com/reactjs/react-redux).

## Why?

Originally `react-native-layout-tester` have a problem for `Dimensions`, you can't get a correct layout with Dimensions for each component if you're using LayouTester wrapper, so we made a `getLayout` decorator to resolve it.

It's mean you must be use `getLayout` instead of `Dimensions` for each component, but you can keep the same code in production.

## Installation

```bash
$ npm install --save react-native-layout-provider
```

## Usage

Use `LayoutProvider` to wrap your app container:

```js
import React from 'react';
import LayoutProvider from 'react-native-layout-provider';

export default () => (
  <LayoutProvider
    // Default: "Default"
    label={String}

    // Default: provided by Dimensions
    width={Number},
    height={Number},
    // Default: undefined, you can use react-native-orientation to get portrait
    portrait={Boolean}
  >
    <YourApp />
  </LayoutProvider>
);
```

And use `getLayout` for each component, the component props will update when LayoutProvider props changed:

```js
import React, { Component, PropTypes } from 'react';
import { getLayout, defaultLayoutTypes } from 'react-native-layout-provider';

class Comp extends Component {

  // It's same with defaultLayoutTypes
  static propTypes = {
    label: PropTypes.string.isRequired,
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    portrait: PropTypes.bool,
  };

  render() {
    return (...);
  }
}

export default getLayout(layout => ({
  label: layout.label,
  viewport: {
    width: layout.viewport.width,
    height: layout.viewport.height,
  },
  portrait: layout.portrait,
}))(Comp);
```

Or use [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) to get `@getLayout()` work.

## Advanced example

Use [react-native-orientation](https://github.com/yamill/react-native-orientation) to get / listen orientation, and [react-native-extra-dimensions-android](https://github.com/jaysoo/react-native-extra-dimensions-android) to resolved status bar problem for Android.

```js
import React, { Component, PropTypes } from "react";
import { Platform, Dimensions } from "react-native";
import LayoutProvider, { getLayout } from 'react-native-layout-provider';
import Orientation from 'react-native-orientation';
import ExtraDimensions from 'react-native-extra-dimensions-android';

let statusBarHeight = 0;
if (Platform.OS === 'android') {
  try {
    statusBarHeight = ExtraDimensions.get('STATUS_BAR_HEIGHT');
  } catch(e) {}
}

class App extends Component {
  state = {
    orientation: Orientation.getInitialOrientation(),
  };

  _orientationDidChange = orientation => {
    this.setState({ orientation });
  };

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  render() {
    const { height } = Dimensions.get('window');
    return (
      <LayoutProvider
        label="Default"
        height={height - statusBarHeight} // Resolved statusBar problem for Android
        portrait={this.state.orientation === 'PORTRAIT'}
      >
        ...
      </LayoutProvider>
    );
  }
}
```

## License

[MIT](LICENSE)