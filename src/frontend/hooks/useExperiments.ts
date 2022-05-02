import * as React from "react";
import SettingsContext, { SettingsState } from "../context/SettingsContext";

type useExperimentAction = boolean | ((value: boolean) => boolean);

export function useExperiments() {
  const [settings, setSettings] = React.useContext(SettingsContext);

  const setExperiments = React.useCallback(
    (key: keyof SettingsState["experiments"], val: boolean) => {
      setSettings("experiments", { ...settings.experiments, [key]: val });
    },
    []
  );

  return [settings.experiments, setExperiments] as const;
}
