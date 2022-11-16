import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { ScrollView } from "react-native-gesture-handler";
import { useExperiments } from "../../../hooks/useExperiments";
import { useNavigationFromRoot } from "../../../hooks/useNavigationWithTypes";

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "../../../sharedComponents/List";
import { NativeNavigationComponent } from "../../../sharedTypes";

const m = defineMessages({
  p2pUpgrades: {
    id: "screens.Settings.Experiments.p2pUpgrades",
    defaultMessage: "P2P App Updates",
    description: "Label for p2p app updates",
  },
  p2pUpgradesDesc: {
    id: "screens.Settings.Experiments.p2pUpgradesDesc",
    defaultMessage: "Share and receive updates with nearby devices",
    description: "Label for p2p upgrades description",
  },
  active: {
    id: "screens.Settings.Experiments.active",
    defaultMessage: "On",
    description: "Indicates that the experimental feature is enabled",
  },
  inactive: {
    id: "screens.Settings.Experiments.inactive",
    defaultMessage: "Off",
    description: "Indicates that the experimental feature is not enabled",
  },
  directionalArrow: {
    id: "screens.Settings.Experiments.directionalArrow",
    defaultMessage: "Directional Arrow",
  },
  title: {
    id: "screens.Settings.Experiments.title",
    defaultMessage: "Experiments",
  },
  BGMaps: {
    id: "screens.Settings.Experiments.BGMaps",
    defaultMessage: "Background Maps",
  },
});

const Experiments: NativeNavigationComponent<"Experiments"> = () => {
  const [experiments] = useExperiments();

  const { navigate } = useNavigationFromRoot();

  return (
    <ScrollView testID="experimentsList">
      <List>
        <ListItem
          onPress={() => navigate("P2pUpgrade")}
          testID="p2pUpgradeExperimentButton"
        >
          <ListItemIcon iconName="sync" />
          <ListItemText
            primary={<FormattedMessage {...m.p2pUpgrades} />}
            secondary={
              experiments.p2pUpgrade ? (
                <FormattedMessage {...m.active} />
              ) : (
                <FormattedMessage {...m.inactive} />
              )
            }
          />
        </ListItem>
        <ListItem onPress={() => navigate("DirectionalArrow")}>
          <ListItemIcon iconName="map" />
          <ListItemText
            primary={<FormattedMessage {...m.directionalArrow} />}
            secondary={
              experiments.directionalArrow ? (
                <FormattedMessage {...m.active} />
              ) : (
                <FormattedMessage {...m.inactive} />
              )
            }
          />
        </ListItem>
        {/* <ListItem onPress={() => navigate("BGMapsSettings")}>
          <ListItemIcon iconName="map" />
          <ListItemText
            primary={<FormattedMessage {...m.BGMaps} />}
            secondary={
              experiments.backgroundMaps ? (
                <FormattedMessage {...m.active} />
              ) : (
                <FormattedMessage {...m.inactive} />
              )
            }
          />
        </ListItem> */}
      </List>
    </ScrollView>
  );
};

Experiments.navTitle = m.title;

export default Experiments;
