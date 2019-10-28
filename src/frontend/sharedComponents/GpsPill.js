// @flow
import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { useIsFocused, useNavigation } from "react-navigation-hooks";

import LocationContext from "../context/LocationContext";
import { GpsIcon } from "./icons";
import { getLocationStatus } from "../lib/utils";
import type { LocationStatus } from "../lib/utils";

const m = defineMessages({
  noGps: {
    id: "sharedComponents.GpsPill.noGps",
    defaultMessage: "No GPS"
  },
  searching: {
    id: "sharedComponents.GpsPill.searching",
    defaultMessage: "Searching…"
  }
});

const ERROR_COLOR = "#FF0000";

type Props = {
  onPress: null | (() => void),
  precision?: number,
  variant: LocationStatus
};

export const GpsPill = React.memo<Props>(
  ({ onPress, variant, precision }: Props) => {
    const isFocused = useIsFocused();
    const { formatMessage: t } = useIntl();
    let text: string;
    if (variant === "error") text = t(m.noGps);
    else if (variant === "searching" || typeof precision === "undefined")
      text = t(m.searching);
    else text = `± ${precision} m`;
    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            styles.container,
            variant === "error" ? styles.error : undefined
          ]}>
          <View style={styles.icon}>
            {isFocused && <GpsIcon variant={variant} />}
          </View>
          <Text style={styles.text} numberOfLines={1}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

const ConnectedGpsPill = () => {
  const navigation = useNavigation();
  const location = React.useContext(LocationContext);
  const locationStatus = getLocationStatus(location);
  const precision = location.position && location.position.coords.accuracy;

  const handlePress = React.useCallback(() => {
    navigation.navigate("GpsModal");
  }, [navigation]);

  return (
    <GpsPill
      onPress={handlePress}
      precision={
        typeof precision === "number" ? Math.round(precision) : undefined
      }
      variant={locationStatus}
    />
  );
};

export default ConnectedGpsPill;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    minWidth: 100,
    maxWidth: 200,
    borderRadius: 18,
    height: 36,
    paddingLeft: 32,
    paddingRight: 20,
    borderWidth: 3,
    borderColor: "#33333366",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  error: {
    backgroundColor: ERROR_COLOR
  },
  text: {
    color: "white"
  },
  icon: {
    position: "absolute",
    left: 6
  }
});
