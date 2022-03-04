import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { SecurityContext } from "../../context/SecurityContext";
import SettingsContext from "../../context/SettingsContext";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import IconButton from "../../sharedComponents/IconButton";
import { BackIcon } from "../../sharedComponents/icons";
import { InputPasscodeScreen } from "./InputPasscodeScreen";
import { PasscodeIntro } from "./PasscodeIntro";
import { EnterPasscode, TurnOffPasscode } from "./TurnOffPasscode";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode",
    defaultMessage: "App Passcode",
  },
});

export type PasscodeScreens =
  | "intro"
  | "setPasscode"
  | "confirmSetPasscode"
  | "enterPasscode"
  | "disablePasscode";

export const AppPasscode: NavigationStackScreenComponent = () => {
  const [{ passcode }] = React.useContext(SecurityContext);
  const [{ experiments }] = React.useContext(SettingsContext);
  const { navigate } = useNavigation();
  const [authState] = React.useContext(SecurityContext);

  const [screenState, setScreenState] = React.useState<PasscodeScreens>(() =>
    !!authState.passcode ? "enterPasscode" : "intro"
  );

  React.useEffect(() => {
    if (!experiments.appPasscode) navigate("Settings");
  }, [experiments]);

  const screen = React.useMemo(() => {
    if (screenState === "intro") {
      return <PasscodeIntro setScreen={setScreenState} />;
    }

    if (
      screenState === "setPasscode" ||
      screenState === "confirmSetPasscode" ||
      screenState === "enterPasscode"
    ) {
      return (
        <InputPasscodeScreen
          screenState={screenState}
          setScreenState={setScreenState}
        />
      );
    }

    return <TurnOffPasscode />;
  }, [screenState]);

  return <View style={styles.pageContainer}>{screen}</View>;
};

AppPasscode.navigationOptions = () => ({
  headerTitle: () => (
    <HeaderTitle style={{}}>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
  headerLeft: ({ onPress }) =>
    onPress && (
      <IconButton onPress={onPress}>
        <BackIcon />
      </IconButton>
    ),
});
const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
});
