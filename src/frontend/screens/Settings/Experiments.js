// @flow
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import SettingsContext from "../../context/SettingsContext";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "../../sharedComponents/List";

const m = defineMessages({
  p2pUpgrades: {
    id: "screens.Settings.Experiments.p2pUpgrades",
    defaultMessage: "P2P upgrades",
    description: "Label for p2p upgrades",
  },
  p2pUpgradesDesc: {
    id: "screens.Settings.Experiments.p2pUpgradesDesc",
    defaultMessage: "Share and receive updates with nearby devices",
    description: "Label for p2p upgrades description",
  },
});

const Experiments = () => {
  const [{ experiments }, setSettings] = React.useContext(SettingsContext);

  return (
    <List testID="experimentsList">
      <ListItem
        onPress={() =>
          setSettings("experiments", {
            ...experiments,
            p2pUpgrade: !experiments.p2pUpgrade,
          })
        }
        testID="p2pUpgradeExperimentButton"
      >
        <ListItemIcon
          iconName={
            experiments.p2pUpgrade ? "check-box" : "check-box-outline-blank"
          }
        />
        <ListItemText
          primary={<FormattedMessage {...m.p2pUpgrades} />}
          secondary={<FormattedMessage {...m.p2pUpgradesDesc} />}
        ></ListItemText>
      </ListItem>
    </List>
  );
};

export default Experiments;