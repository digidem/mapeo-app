// @flow
import * as React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
import { TouchableNativeFeedback } from "../sharedComponents/Touchables";

import { VERY_LIGHT_BLUE } from "../lib/styles";
import type { Style } from "../types";

// Fix warning pending https://github.com/kmagiera/react-native-gesture-handler/pull/561/files
TouchableNativeFeedback.propTypes = {
  ...TouchableNativeFeedback.propTypes,
  background: PropTypes.object
};

type Props = {
  onPress: (SyntheticEvent<>) => any,
  style?: Style<typeof View>,
  title: string,
  testID?: string
};

const TextButton = ({ onPress, style, title, testID }: Props) => (
  <TouchableNativeFeedback
    style={[styles.buttonContainer, style]}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title.toUpperCase()}</Text>
  </TouchableNativeFeedback>
);

export default TextButton;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "blue",
    fontWeight: "700"
  }
});
