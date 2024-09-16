// @flow
import "react-native-gesture-handler";

import * as React from "react";
import { LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// We need to wrap the app with this provider to fix an issue with the bottom sheet modal backdrop
// not overlaying the navigation header. Without this, the header is accessible even when
// the modal is open, which we don't want (e.g. header back button shouldn't be reachable).
// See https://github.com/gorhom/react-native-bottom-sheet/issues/1157
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import ErrorScreen from "./screens/UncaughtError";
import { AppLoading } from "./AppLoading";
import AppContainerWrapper from "./AppContainerWrapper";
import { PermissionsProvider } from "./context/PermissionsContext";
import { IntlProvider } from "./context/IntlContext";
import AppProvider from "./context/AppProvider";
import bugsnag from "./lib/logger";
import useUpdateNotifierEffect from "./hooks/useUpdateNotifierEffect";
import { ERROR_STORE_KEY } from "./constants";

/**
 * Turn off warnings about:
 * - require cycles
 * - react-native-screens warning that suggests upgrading react-navigation to 5
 */
LogBox.ignoreLogs([
  "Require cycle:",
  "new functionality added to react-native-screens",
]);

const ErrorBoundary = bugsnag.getPlugin("react").createErrorBoundary(React);

const onError = event => {
  // This is rendered outside AppLoading, so SpashScreen could still be
  // showing if error occurs in AppLoading before it's hidden
  SplashScreen.hide();
  // Record that we have an error so that when the app restarts we can
  // react to the previous uncaught error
  AsyncStorage.setItem(ERROR_STORE_KEY, JSON.stringify(true));
};

const UpdateNotifier = () => {
  useUpdateNotifierEffect();
  return null;
};

/* IntlProvider needs to be first so that error messages are translated */
const App = () => (
  <IntlProvider>
    <ErrorBoundary FallbackComponent={ErrorScreen} onError={onError}>
      {/* Permissions provider must be before AppLoading because it waits for
        permissions before showing main app screen */}
      <PermissionsProvider>
        <AppLoading>
          <AppProvider>
            <BottomSheetModalProvider>
              <AppContainerWrapper />
            </BottomSheetModalProvider>
            <UpdateNotifier />
          </AppProvider>
        </AppLoading>
      </PermissionsProvider>
    </ErrorBoundary>
  </IntlProvider>
);

export default App;

const formatComponentStack = str => {
  const lines = str.split(/\s*\n\s*/g);
  let ret = "";
  for (let line = 0, len = lines.length; line < len; line++) {
    if (lines[line].length) ret += `${ret.length ? "\n" : ""}${lines[line]}`;
  }
  return ret;
};
