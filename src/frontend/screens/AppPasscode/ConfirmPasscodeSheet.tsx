import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet } from "react-native";
import { SecurityContext } from "../../context/SecurityContext";
import { RED } from "../../lib/styles";
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from "../../sharedComponents/BottomSheetModal";
import { ErrorIcon } from "../../sharedComponents/icons";
import { NativeRootNavigationProps } from "../../sharedTypes";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode.ConfirmPasscodeSheet.title",
    defaultMessage:
      "App Passcodes can never be recovered if lost or forgotten! Make sure to note your passcode in a secure location before saving.",
  },
  cancel: {
    id: "screens.AppPasscode.ConfirmPasscodeSheet.cancel",
    defaultMessage: "Cancel",
  },
  saveAppPasscode: {
    id: "screens.AppPasscode.ConfirmPasscodeSheet.saveAppPasscode",
    defaultMessage: "Save App Passcode",
  },
  passcode: {
    id: "screens.AppPasscode.ConfirmPasscodeSheet.passcode",
    defaultMessage: "Passcode",
    description: "used to indicate to the user what the new passcode will be.",
  },
});

export const ConfirmPasscodeSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<"ConfirmPasscodeSheet">) => {
  const { formatMessage: t } = useIntl();
  const { setAuthValues } = React.useContext(SecurityContext);
  const { sheetRef, isOpen } = useBottomSheetModal({
    openOnMount: true,
  });
  const { passcode } = route.params;

  function setPasscodeAndNavigateBack() {
    setAuthValues({ type: "passcode", value: passcode });
    navigation.navigate("Security");
  }

  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
      <BottomSheetContent
        titleStyle={styles.text}
        descriptionStyle={styles.text}
        title={t(m.title)}
        description={`${t(m.passcode)}: ${passcode}`}
        buttonConfigs={[
          {
            text: t(m.cancel),
            onPress: () => {
              navigation.navigate("Security");
            },
            variation: "outlined",
          },
          {
            text: t(m.saveAppPasscode),
            variation: "filled",
            onPress: setPasscodeAndNavigateBack,
          },
        ]}
        icon={
          <ErrorIcon style={{ position: "relative" }} size={90} color={RED} />
        }
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
