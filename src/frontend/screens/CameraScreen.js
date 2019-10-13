// @flow
import * as React from "react";
import { View, StyleSheet } from "react-native";
import debug from "debug";
import { NavigationActions } from "react-navigation";
import { useFocusState, useNavigation } from "react-navigation-hooks";
import { defineMessages, FormattedMessage } from "react-intl";

import CameraView from "../sharedComponents/CameraView";
import HomeHeader from "../sharedComponents/HomeHeader";
import useDraftObservation, {
  type CapturePromise
} from "../hooks/useDraftObservation";
import PermissionsContext, {
  PERMISSIONS,
  RESULTS
} from "../context/PermissionsContext";

const m = defineMessages({
  // Error message shown when app does not have permissions to camera
  noCameraAccess: "No access to camera"
});

const log = debug("mapeo:CameraScreen");

const CameraScreen = () => {
  const focusState = useFocusState();
  const [, { newDraft }] = useDraftObservation();
  const navigation = useNavigation();

  const handleAddPress = React.useCallback(
    (e: any, capture: CapturePromise) => {
      log("pressed add button");
      newDraft(undefined, { tags: {} }, capture);
      navigation.navigate(
        "NewObservation",
        {},
        NavigationActions.navigate({ routeName: "CategoryChooser" })
      );
    },
    [newDraft, navigation]
  );

  return (
    <View style={styles.container}>
      <PermissionsContext.Consumer>
        {({ permissions }) => {
          if (permissions[PERMISSIONS.CAMERA] !== RESULTS.GRANTED)
            return <FormattedMessage {...m.noCameraAccess} />;
          if (focusState.isBlurred || focusState.isFocusing) return null;
          return <CameraView onAddPress={handleAddPress} />;
        }}
      </PermissionsContext.Consumer>
      <HomeHeader />
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
});
