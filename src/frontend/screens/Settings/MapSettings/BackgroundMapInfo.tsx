import MapboxGL from "@react-native-mapbox-gl/maps";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, Text, View } from "react-native";

import { MAPEO_BLUE, MEDIUM_GREY, WHITE } from "../../../lib/styles";
import Button from "../../../sharedComponents/Button";
import { NativeRootNavigationProps } from "../../../sharedTypes";
import { DeleteMapBottomSheet } from "./DeleteMapBottomSheet";
import { DEFAULT_MAP_ID, useMapStyles } from "../../../hooks/useMapStyles";
import { DeleteIcon } from "../../../sharedComponents/icons";
import { useBottomSheetModal } from "../../../sharedComponents/BottomSheetModal";
import { bytesToMegabytes } from ".";

const m = defineMessages({
  removeMap: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.removeMap",
    defaultMessage: "Remove Map",
  },
  cancel: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.cancel",
    defaultMessage: "Cancel",
  },
  subtitle: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.subtitle",
    defaultMessage:
      "This map and offline areas attached to it will be deleted. This cannot be undone",
  },
  mb: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.mb",
    defaultMessage: "MB",
    description: "abbreviation for megabyte",
  },
  zoomRange: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.zoomRange",
    defaultMessage: "Zoom Range",
    description:
      "Shows the user the range of zoom available for an offline map",
  },
  maxZoom: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.maxZoom",
    defaultMessage: "Max Zoom",
    description: "Shows the user the max zoom for an offline map",
  },
  minZoom: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.minZoom",
    defaultMessage: "Min Zoom",
    description: "Shows the user the min zoom for an offline map",
  },
  description: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.description",
    defaultMessage: "Level of Detail",
  },
  deleteMap: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.deleteMap",
    defaultMessage: "Delete Map",
  },
  useMap: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.useMap",
    defaultMessage: "Use Map",
  },
  // lvlOfDetail0to1: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail0to1",
  //   defaultMessage: "Whole world",
  // },
  // lvlOfDetail2: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail2",
  //   defaultMessage: "Subcontinental area ",
  // },
  // lvlOfDetail3to4: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail3to4",
  //   defaultMessage: "Largest country",
  // },
  // lvlOfDetail5: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail5",
  //   defaultMessage: "Large African country",
  // },
  // lvlOfDetail6: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail6",
  //   defaultMessage: "Large European country",
  // },
  // lvlOfDetail7to8: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail7to8",
  //   defaultMessage: "Small country, US state",
  // },
  // lvlOfDetail9: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail9",
  //   defaultMessage: "Wide area, large metropolitan area",
  // },
  // lvlOfDetail10: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail10",
  //   defaultMessage: "Metropolitan area",
  // },
  // lvlOfDetail11: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail11",
  //   defaultMessage: "City",
  // },
  // lvlOfDetail12: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail12",
  //   defaultMessage: "Town, or city district",
  // },
  // lvlOfDetail13to14: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail13to14",
  //   defaultMessage: "Village, or suburb",
  // },
  // lvlOfDetail15: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail15",
  //   defaultMessage: "Small road",
  // },
  // lvlOfDetail16: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail16",
  //   defaultMessage: "Street",
  // },
  // lvlOfDetail17: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail17",
  //   defaultMessage: "Block, park, addresses",
  // },
  // lvlOfDetail18: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail18",
  //   defaultMessage: "Some buildings, trees",
  // },
  // lvlOfDetail19: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail19",
  //   defaultMessage: "Local highway and crossing details",
  // },
  // lvlOfDetail20: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail20",
  //   defaultMessage: "A mid-sized building",
  // },
});

export const BackgroundMapInfo = ({
  route,
  navigation,
}: NativeRootNavigationProps<"BackgroundMapInfo">) => {
  const { formatMessage: t } = useIntl();
  const { bytesStored, id, styleUrl, name } = route.params;

  const { closeSheet, openSheet, sheetRef, isOpen } = useBottomSheetModal({
    openOnMount: false,
  });

  const { setSelectedStyleId } = useMapStyles();

  function setStyleAndNavigateHome() {
    setSelectedStyleId(id);
    navigation.navigate("Home", { screen: "Map" });
  }

  return (
    <View style={styles.flex}>
      <View style={styles.flex}>
        <MapboxGL.MapView
          styleURL={styleUrl}
          compassEnabled={false}
          zoomEnabled={false}
          logoEnabled={false}
          scrollEnabled={false}
          style={{ height: "55%" }}
        >
          <MapboxGL.Camera
            zoomLevel={0}
            animationDuration={0}
            animationMode={"linearTo"}
            allowUpdates={true}
          />
        </MapboxGL.MapView>
        <View style={[styles.flex, styles.container]}>
          <View>
            {bytesStored > 0 ? (
              <Text style={styles.detailsText}>
                {`${bytesToMegabytes(bytesStored).toFixed(0)} ${t(m.mb)}`}
              </Text>
            ) : null}
          </View>
          <View>
            {id !== DEFAULT_MAP_ID && (
              <Button fullWidth variant="outlined" onPress={openSheet}>
                <View style={styles.deleteButtonContainer}>
                  <View style={styles.buttonTextIconContainer}>
                    <DeleteIcon color={MAPEO_BLUE} size={26} />
                  </View>
                  <Text style={[styles.buttonText, { color: MAPEO_BLUE }]}>
                    {t(m.deleteMap)}
                  </Text>
                </View>
              </Button>
            )}
            <Button
              fullWidth
              style={{ marginTop: 20 }}
              onPress={setStyleAndNavigateHome}
            >
              <Text style={[styles.buttonText, { color: WHITE }]}>
                {t(m.useMap)}
              </Text>
            </Button>
          </View>
        </View>
      </View>

      <DeleteMapBottomSheet
        ref={sheetRef}
        mapName={name}
        mapId={id}
        closeSheet={closeSheet}
        isOpen={isOpen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    justifyContent: "space-between",
  },
  detailsText: {
    fontSize: 14,
    color: MEDIUM_GREY,
  },
  buttonTextIconContainer: { marginRight: 4 },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
