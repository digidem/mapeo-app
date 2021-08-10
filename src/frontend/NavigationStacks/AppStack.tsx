import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ObservationList from "../screens/ObservationsList";
import Observation from "../screens/Observation";
import ObservationEdit from "../screens/ObservationEdit";
import AddPhoto from "../screens/AddPhoto";
import ObservationDetails from "../screens/ObservationDetails";
import CategoryChooser from "../screens/CategoryChooser";
import GpsModal from "../screens/GpsModal";
import SyncModal from "../screens/SyncModal";
import Settings from "../screens/Settings";
import PhotosModal from "../screens/PhotosModal";
import ManualGpsScreen from "../screens/ManualGpsScreen";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";
import ProjectConfig from "../screens/Settings/ProjectConfig";
import AboutMapeo from "../screens/Settings/AboutMapeo";
import LanguageSettings from "../screens/Settings/LanguageSettings";
import CoordinateFormat from "../screens/Settings/CoordinateFormat";
import HomeHeader from "../sharedComponents/HomeHeader";
import { LeaveProjectScreen } from "../screens/LeaveProject/LeaveProject";
import { LeaveProjectProgress } from "../screens/LeaveProject/LeaveProjectProgess";
import { LeaveProjectCompleted } from "../screens/LeaveProject/LeaveProjectCompleted";
import { AlreadyOnProj } from "../screens/AlreadyOnProject";
import HomeTabComponent from "./HomeTabs";

export type AppStackNavTypes = {
  Home: undefined;
  GpsModal: undefined;
  SyncModal: undefined;
  Settings: undefined;
  ProjectConfig: undefined;
  AboutMapeo: undefined;
  LanguageSettings: undefined;
  CoordinateFormat: undefined;
  PhotosModal: undefined;
  CategoryChooser: undefined;
  AddPhoto: undefined;
  ObservationList: undefined;
  Observation: undefined;
  ObservationEdit: undefined;
  ManualGpsScreen: undefined;
  ObservationDetails: undefined;
  LeaveProjectScreen: undefined;
  LeaveProjectProgress: undefined;
  LeaveProjectCompleted: undefined;
  AlreadyOnProj: undefined;
};

const Stack = createStackNavigator<AppStackNavTypes>();

export const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        presentation: "card",
        headerMode: "screen",
        // We use a slightly larger back icon, to improve accessibility
        // TODO iOS: This should probably be a chevron not an arrow
        headerStyle: { height: 60 },
        headerLeft: props => <CustomHeaderLeft {...props} />,
        headerTitleStyle: { marginHorizontal: 0 },
        cardStyle: { backgroundColor: "#ffffff" },
      })}
    >
      <Stack.Screen name="Home" component={HomeTabComponent} />
      <Stack.Screen name="GpsModal" component={GpsModal} />
      <Stack.Screen name="SyncModal" component={SyncModal} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ProjectConfig" component={ProjectConfig} />
      <Stack.Screen name="AboutMapeo" component={AboutMapeo} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
      <Stack.Screen name="CoordinateFormat" component={CoordinateFormat} />
      <Stack.Screen name="PhotosModal" component={PhotosModal} />
      <Stack.Screen name="CategoryChooser" component={CategoryChooser} />
      <Stack.Screen name="AddPhoto" component={AddPhoto} />
      <Stack.Screen name="ObservationList" component={ObservationList} />
      <Stack.Screen name="Observation" component={Observation} />
      <Stack.Screen name="ObservationEdit" component={ObservationEdit} />
      <Stack.Screen name="ManualGpsScreen" component={ManualGpsScreen} />
      <Stack.Screen name="ObservationDetails" component={ObservationDetails} />
      <Stack.Screen name="LeaveProjectScreen" component={LeaveProjectScreen} />
      <Stack.Screen
        name="LeaveProjectProgress"
        component={LeaveProjectProgress}
      />
      <Stack.Screen
        name="LeaveProjectCompleted"
        component={LeaveProjectCompleted}
      />
      <Stack.Screen name="AlreadyOnProj" component={AlreadyOnProj} />
    </Stack.Navigator>
  );
};