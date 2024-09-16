import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import { RED } from "../../lib/styles";

import {
  BottomSheetModal,
  BottomSheetContent,
} from "../../sharedComponents/BottomSheetModal";
import { ErrorIcon } from "../../sharedComponents/icons";

interface ModalProps {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  isOpen: boolean;
  photoIndex: number;
  closeSheet: () => void;
  disableBackdrop: boolean;
}

const m = defineMessages({
  deletePhotoHeader: {
    id: "screens.Photos.ConfirmDeleteModal.deletePhotoHeader",
    defaultMessage: "Delete this photo?",
  },
  deletePhotoButton: {
    id: "screens.Photos.ConfirmDeleteModal.deletePhotoButton",
    defaultMessage: "Delete Image",
  },
  cancel: {
    id: "screens.Photos.ConfirmDeleteModal.cancel",
    defaultMessage: "Cancel",
  },
});

export const ConfirmDeleteModal = ({
  sheetRef,
  isOpen,
  photoIndex,
  closeSheet,
  disableBackdrop,
}: ModalProps) => {
  const [{ photos }, { deletePhoto }] = useDraftObservation();
  const { formatMessage: t } = useIntl();
  const navigation = useNavigationFromRoot();

  function photoDelete() {
    const photoToDelete = photos[photoIndex];
    if ("originalUri" in photoToDelete) {
      const uri = photoToDelete.originalUri;
      if (uri) deletePhoto(uri);
      closeSheet();
      navigation.pop();
    }
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      isOpen={isOpen}
      disableBackrop={disableBackdrop}
      onDismiss={closeSheet}
      onBack={closeSheet}
    >
      <BottomSheetContent
        buttonConfigs={[
          {
            variation: "filled",
            dangerous: true,
            onPress: () => photoDelete(),
            text: t(m.deletePhotoButton),
          },
          {
            variation: "outlined",
            onPress: closeSheet,
            text: t(m.cancel),
          },
        ]}
        title={t(m.deletePhotoHeader)}
        icon={
          <ErrorIcon style={{ position: "relative" }} size={90} color={RED} />
        }
      />
    </BottomSheetModal>
  );
};
