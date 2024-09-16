import * as React from "react";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { RED, WHITE } from "../../../lib/styles";
import { DeleteIcon, ErrorIcon } from "../../../sharedComponents/icons";
import api from "../../../api";
import { useNavigationFromRoot } from "../../../hooks/useNavigationWithTypes";
import { DEFAULT_MAP_ID, useMapStyles } from "../../../hooks/useMapStyles";
import {
  BottomSheetModal,
  BottomSheetContent,
} from "../../../sharedComponents/BottomSheetModal";

const m = defineMessages({
  deleteMapMessage: {
    id: "screens.Settings.MapSettings.DeleteMapBottomSheet.deleteMapMessage",
    defaultMessage: "Are you sure you want to delete {mapName}?",
  },
  deleteMapWarning: {
    id: "screens.Settings.MapSettings.DeleteMapBottomSheet.deleteMapWarning",
    defaultMessage:
      "This area will no longer be available offline. Cannot be undone.",
  },
  deleteMap: {
    id: "screens.Settings.MapSettings.DeleteMapBottomSheet.deleteMap",
    defaultMessage: "Delete Map",
  },
  cancel: {
    id: "screens.Settings.MapSettings.DeleteMapBottomSheet.cancel",
    defaultMessage: "Cancel",
  },
});

interface DeleteMapBottomSheetProps {
  mapName: string;
  mapId: string;
  closeSheet: () => void;
  isOpen: boolean;
}

export const DeleteMapBottomSheet = React.forwardRef<
  BottomSheetModalMethods,
  DeleteMapBottomSheetProps
>(({ isOpen, mapName, closeSheet, mapId }, sheetRef) => {
  const { navigate } = useNavigationFromRoot();
  const { formatMessage: t } = useIntl();
  const { selectedStyleId, setSelectedStyleId } = useMapStyles();

  function deleteMap() {
    // Cannot delete Default Map
    if (mapId === DEFAULT_MAP_ID) {
      return;
    }

    api.maps
      .deleteStyle(mapId)
      .then(() => {
        // If user is deleting the map that is currently being used, we want to set the map to be the default map
        if (selectedStyleId === mapId) {
          setSelectedStyleId(DEFAULT_MAP_ID);
        }
        navigate("BackgroundMaps");
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <BottomSheetModal ref={sheetRef} onDismiss={closeSheet} isOpen={isOpen}>
      <BottomSheetContent
        descriptionStyle={{ fontSize: 16 }}
        title={
          <FormattedMessage
            {...m.deleteMapMessage}
            values={{ mapName: mapName }}
          />
        }
        description={t(m.deleteMapWarning)}
        icon={
          <ErrorIcon style={{ position: "relative" }} size={90} color={RED} />
        }
        buttonConfigs={[
          {
            text: t(m.deleteMap),
            icon: <DeleteIcon color={WHITE} size={26} />,
            variation: "filled",
            onPress: deleteMap,
            dangerous: true,
          },
          {
            text: t(m.cancel),
            variation: "outlined",
            onPress: closeSheet,
          },
        ]}
      />
    </BottomSheetModal>
  );
});
