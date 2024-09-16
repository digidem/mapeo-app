/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import ConfigContext from "../context/ConfigContext";
import {
  BottomSheetModal,
  BottomSheetContent,
  useBottomSheetModal,
} from "../sharedComponents/BottomSheetModal";
import { DoneIcon } from "../sharedComponents/icons";
import Circle from "../sharedComponents/icons/Circle";
import { MAPEO_BLUE, WHITE } from "../lib/styles";
import { NativeRootNavigationProps } from "../sharedTypes";

const m = defineMessages({
  joinTitle: {
    id: "screens.JoinRequestModal.joinTitle",
    defaultMessage: "{deviceName} wants to join {projectName}",
  },
  denyRequest: {
    id: "screens.JoinRequestModal.denyRequest",
    defaultMessage: "Deny Request",
  },
  invite: {
    id: "screens.JoinRequestModal.invite",
    defaultMessage: "Invite",
  },
  success: {
    id: "screens.JoinRequestModal.success",
    defaultMessage: "Success!",
  },
  inviteSent: {
    id: "screens.JoinRequestModal.inviteSent",
    defaultMessage: "Invite has been sent.",
  },
  close: {
    id: "screens.JoinRequestModal.close",
    defaultMessage: "Close",
  },
});

export const JoinRequestModal = ({
  navigation,
  route,
}: NativeRootNavigationProps<"JoinRequestModal">) => {
  const { formatMessage: t } = useIntl();
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState<"prompt" | "success">("prompt");

  const [config] = React.useContext(ConfigContext);

  const { sheetRef, isOpen, closeSheet } = useBottomSheetModal({
    openOnMount: true,
  });

  const projectName = config.metadata.name;
  const deviceName = route.params?.deviceName || "";
  const key = route.params?.key || "";

  // TODO: do something with `key` here
  const invite = async () => {
    if (loading) return;

    setLoading(true);

    await new Promise(res => {
      setTimeout(res, 100);
    });

    setLoading(false);
    setStep("success");
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      isOpen={isOpen}
      onDismiss={navigation.goBack}
    >
      {step === "prompt" ? (
        <BottomSheetContent
          buttonConfigs={[
            {
              variation: "outlined",
              onPress: closeSheet,
              text: t(m.denyRequest),
            },
            {
              variation: "filled",
              onPress: invite,
              text: t(m.invite),
            },
          ]}
          icon={
            <Circle radius={40}>
              <MaterialIcon color="#000033" name="person-add" size={30} />
            </Circle>
          }
          title={t(m.joinTitle, { deviceName, projectName })}
        />
      ) : (
        <BottomSheetContent
          buttonConfigs={[
            {
              variation: "outlined",
              onPress: closeSheet,
              text: t(m.close),
            },
          ]}
          description={t(m.inviteSent)}
          icon={
            <Circle
              radius={40}
              style={{ backgroundColor: MAPEO_BLUE, elevation: 0 }}
            >
              <DoneIcon color={WHITE} size={40} />
            </Circle>
          }
          title={t(m.success)}
        />
      )}
    </BottomSheetModal>
  );
};
