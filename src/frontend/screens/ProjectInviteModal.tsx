/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import ConfigContext from "../context/ConfigContext";
import ObservationsContext from "../context/ObservationsContext";
import useIsMounted from "../hooks/useIsMounted";
import { DARK_BLUE, MAGENTA, MAPEO_BLUE, WHITE } from "../lib/styles";
import {
  BottomSheetModal,
  BottomSheetContent,
  useBottomSheetModal,
} from "../sharedComponents/BottomSheetModal";
import Text from "../sharedComponents/Text";
import { DoneIcon } from "../sharedComponents/icons";
import Circle from "../sharedComponents/icons/Circle";
import Loading from "../sharedComponents/Loading";
import { NativeRootNavigationProps } from "../sharedTypes";

interface ProjectInviteDetails {
  project: {
    id: string;
    name: string;
  };
  role: string;
}

type LoadingStatus = {
  type: "loading";
};

type ErrorStatus = {
  type: "error";
  info: { error: Error };
};

type SuccessStatus = {
  type: "success";
  info: {
    inviteDetails: ProjectInviteDetails;
  };
};

const m = defineMessages({
  title: {
    id: "screens.ProjectInviteModal.title",
    defaultMessage: "Join {projectName}",
  },
  inviteMessage: {
    id: "screens.ProjectInviteModal.inviteMessage",
    defaultMessage: "You've been invited to join\n {projectName} as a {role}",
  },
  declineInvite: {
    id: "screens.ProjectInviteModal.declineInvite",
    defaultMessage: "Decline Invite",
  },
  joinAndSync: {
    id: "screens.ProjectInviteModal.joinAndSync",
    defaultMessage: "Join and Sync",
  },
  close: {
    id: "screens.ProjectInviteModal.close",
    defaultMessage: "Close",
  },
  tryAgain: {
    id: "screens.ProjectInviteModal.tryAgain",
    defaultMessage: "Try Again",
  },
  inviteErrorMessage: {
    id: "screens.ProjectInviteModal.inviteErrorMessage",
    defaultMessage: "Could not retrieve invite details",
  },
});

// Gregor TODO: Add method to API for decrypting invite
const getProjectInviteDetails = async (
  inviteKey: string
): Promise<ProjectInviteDetails> => {
  return new Promise((res, rej) => {
    setTimeout(
      () =>
        Math.random() > 0
          ? res({
              project: {
                name: `Project ${Math.floor(Math.random() * 1000)}`,
                id: "123",
              },
              role: "Project Participant",
            })
          : rej(new Error(m.inviteErrorMessage.defaultMessage)),
      1000
    );
  });
};

export const ProjectInviteModal = ({
  route,
  navigation,
}: NativeRootNavigationProps<"ProjectInviteModal">) => {
  const { formatMessage: t } = useIntl();
  const isMounted = useIsMounted();
  const { sheetRef, isOpen, closeSheet } = useBottomSheetModal({
    openOnMount: true,
  });
  const [{ observations }] = React.useContext(ObservationsContext);
  const [config] = React.useContext(ConfigContext);

  // TODO: need an official way to determine this
  const isInPracticeMode = config.metadata.name === "mapeo-default-settings";

  const inviteKey = route.params.inviteKey;

  const [status, setStatus] = React.useState<
    LoadingStatus | ErrorStatus | SuccessStatus
  >(
    inviteKey
      ? { type: "loading" }
      : { type: "error", info: { error: new Error(t(m.inviteErrorMessage)) } }
  );

  const fetchInviteDetails = React.useCallback(
    async (inviteKey: string) => {
      try {
        setStatus({ type: "loading" });

        const inviteDetails = await getProjectInviteDetails(inviteKey);

        if (isMounted()) {
          setStatus({ type: "success", info: { inviteDetails } });
        }
      } catch (err) {
        if (isMounted() && err instanceof Error) {
          setStatus({ type: "error", info: { error: err } });
        }
      }
    },
    [isMounted]
  );

  const goToSync = (keepExistingObservations: boolean) =>
    navigation.navigate("SyncOnboardingScreen", { keepExistingObservations });

  const acceptInvite = () => {
    if (isInPracticeMode && observations.size > 0) {
      navigation.navigate("ConfirmLeavePracticeModeScreen", {
        projectAction: "join",
      });
    } else {
      goToSync(false);
    }
  };

  React.useEffect(() => {
    if (inviteKey) {
      fetchInviteDetails(inviteKey);
    }
  }, [fetchInviteDetails, inviteKey]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      isOpen={isOpen}
      onDismiss={navigation.goBack}
    >
      {status.type === "loading" ? (
        <Loading />
      ) : status.type === "error" ? (
        <BottomSheetContent
          buttonConfigs={[
            {
              variation: "outlined",
              onPress: closeSheet,
              text: t(m.close),
            },
            {
              variation: "filled",
              onPress: () => {
                if (inviteKey) {
                  fetchInviteDetails(inviteKey);
                }
              },
              text: t(m.tryAgain),
            },
          ]}
          icon={
            <View>
              <Circle radius={40} style={styles.mapeoIconContainer}>
                <Image
                  style={styles.mapeoIcon}
                  source={require("../images/mapeo-icon-transparent.png")}
                />
              </Circle>
              <Circle radius={12} style={styles.errorIconContainer}>
                <MaterialIcon name="error" size={24} style={styles.errorIcon} />
              </Circle>
            </View>
          }
          title={status.info.error.message}
        />
      ) : (
        <BottomSheetContent
          buttonConfigs={[
            {
              text: t(m.declineInvite),
              variation: "outlined",
              onPress: closeSheet,
            },
            {
              text: t(m.joinAndSync),
              variation: "filled",
              onPress: acceptInvite,
            },
          ]}
          description={t(m.inviteMessage, {
            projectName: (
              <Text style={styles.bold}>
                {status.info.inviteDetails.project.name}
              </Text>
            ),
            role: (
              <Text style={styles.bold}>{status.info.inviteDetails.role}</Text>
            ),
          })}
          icon={
            <Circle radius={40} style={styles.checkmarkCircle}>
              <DoneIcon color={WHITE} size={40} />
            </Circle>
          }
          title={t(m.title, {
            projectName: status.info.inviteDetails.project.name,
          })}
        />
      )}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  checkmarkCircle: {
    backgroundColor: MAPEO_BLUE,
    elevation: 0,
    flexDirection: "row",
  },
  mapeoIconContainer: { backgroundColor: DARK_BLUE },
  mapeoIcon: { transform: [{ scale: 0.15 }] },
  errorIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    borderWidth: 0,
    backgroundColor: WHITE,
  },
  errorIcon: {
    transform: [{ scale: 1.25 }],
    color: MAGENTA,
  },
  bold: { fontWeight: "700" },
});
