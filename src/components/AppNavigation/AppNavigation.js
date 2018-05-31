// @flow
import React from 'react';
import { BackHandler, AppState, Dimensions, Image, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import MainStackNavigation from '../MainNavigation/MainStackNavigation';
import SplashScreen from '../../images/splash-screen.png';
import { mainStackNavigationPropConstructor } from '../../lib/store';
import { initializeListeners } from 'react-navigation-redux-helpers';

interface Props {
  dispatch: any;
  navigationState: any;
}

interface State {
  showSplash: boolean;
  appState: any;
}

class AppNavigation extends React.PureComponent<Props, State> {
  state = {
    appState: AppState.currentState,
    showSplash: true
  };

  componentDidMount() {
    const { dispatch, navigationState } = this.props;
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.shouldCloseApp(navigationState)) return false;
      dispatch(NavigationActions.back());
      return true;
    });
    AppState.addEventListener('change', this.handleAppStateChange);
    this.timeout = setTimeout(() => this.setState({ showSplash: false }), 500);
    initializeListeners('mainStack', navigationState);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    AppState.removeEventListener('change', this.handleAppStateChange);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout: any;

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState &&
      this.state.appState.match(/background/) &&
      nextAppState === 'active'
    ) {
      this.setState({ showSplash: true }, () => {
        this.timeout = setTimeout(
          () => this.setState({ showSplash: false }),
          1000
        );
      });
    }
    this.setState({ appState: nextAppState });
  };

  shouldCloseApp = (nav: any) => nav.index === 0;

  render() {
    const { dispatch, navigationState } = this.props;
    const { showSplash } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <MainStackNavigation
          navigation={mainStackNavigationPropConstructor(
            dispatch,
            navigationState
          )}
        />
        {showSplash && (
          <Image
            source={SplashScreen}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height
            }}
          />
        )}
      </View>
    );
  }
}

export default AppNavigation;
