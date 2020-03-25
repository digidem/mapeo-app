// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";

// import type { MapStyle } from "../types";
import { LocationFollowingIcon, LocationNoFollowIcon } from "./icons";
import IconButton from "./IconButton";
import withNavigationFocus from "../lib/withNavigationFocus";
import type {
  LocationContextType,
  PositionType
} from "../context/LocationContext";
import type { ObservationsMap } from "../context/ObservationsContext";
import bugsnag from "../lib/logger";
import config from "../../config.json";
import Loading from "./Loading";

MapboxGL.setAccessToken(config.mapboxAccessToken);
// Forces Mapbox to always be in connected state, rather than reading system
// connectivity state
MapboxGL.setConnected(true);

const mapboxStyles = {
  observation: {
    circleColor: "#F29D4B",
    circleRadius: 5,
    circleStrokeColor: "#fff",
    circleStrokeWidth: 2
  }
};

type ObservationFeature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [number, number] | [number, number, number]
  },
  properties: {| id: string |}
};

/**
 * Convert a map of observations into a GeoJSON FeatureCollection
 *
 * @param {{ [string]: ObservationType }} Observations
 * @returns GeoJSON FeatureCollection with Features that have the observation
 * location and id
 */
function mapObservationsToFeatures(
  obsMap: ObservationsMap
): ObservationFeature[] {
  const features = [];
  for (const obs of obsMap.values()) {
    // Only include observations with a location in the map view
    if (
      typeof obs.value.lon === "number" &&
      typeof obs.value.lat === "number"
    ) {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [obs.value.lon, obs.value.lat]
        },
        properties: {
          id: obs.id
        }
      });
    }
  }
  return features;
}

class ObservationMapLayer extends React.PureComponent<{
  onPress: Function,
  observations: ObservationsMap
}> {
  render() {
    const { onPress, observations } = this.props;
    const featureCollection = {
      type: "FeatureCollection",
      features: mapObservationsToFeatures(observations)
    };
    return (
      <MapboxGL.ShapeSource
        onPress={onPress}
        id={`observations-source`}
        shape={featureCollection}>
        <MapboxGL.CircleLayer id={`circles`} style={mapboxStyles.observation} />
      </MapboxGL.ShapeSource>
    );
  }
}

type Props = {
  observations: ObservationsMap,
  styleURL: string,
  location: LocationContextType,
  onPressObservation: (observationId: string) => any,
  isFocused: boolean
};

type State = {
  // True if the map is following user location
  following: boolean,
  hasFinishedLoadingStyle?: boolean
};

class MapView extends React.Component<Props, State> {
  static defaultProps = {
    onAddPress: () => {},
    onPressObservation: () => {}
  };
  currentZoom: number;
  map: any;
  initialPosition: void | null | PositionType;

  constructor(props: Props) {
    super(props);
    this.initialPosition =
      props.location.position || props.location.savedPosition;
    this.state = {
      following:
        !!props.location.provider &&
        props.location.provider.locationServicesEnabled
    };
  }

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
  }

  // We only use the location prop (which contains the app GPS location) for the
  // first render of the map. After that location updates come from the native
  // map view, so we don't want to re-render this component every time there is
  // a GPS update, only when the location provider status changes, which we use
  // to render the map in follow-mode or not.
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      shallowDiffers(this.props, nextProps, ["location"]) ||
      shallowDiffers(this.state, nextState) ||
      shallowDiffers(this.props.location.provider, nextProps.location.provider)
    );
  }

  handleObservationPress = (e: {
    nativeEvent?: {
      payload?: {
        properties?: { id: string }
      }
    }
  }) => {
    const pressedFeature = e.nativeEvent && e.nativeEvent.payload;
    if (!pressedFeature || !pressedFeature.properties) return;

    const observationId = pressedFeature.properties.id;
    bugsnag.leaveBreadcrumb("Press observation", { observationId });
    const { observations, onPressObservation } = this.props;
    if (observations.get(observationId)) {
      onPressObservation(observationId);
    } else {
      bugsnag.notify(new Error("Could not find pressed observation"), {
        observationId
      });
    }
  };

  handleMapViewRef = (c: any) => {
    this.map = c;
  };

  handleRegionDidChange = (e: any) => {
    if (!e.properties.isUserInteraction) return;
    // Any user interaction with the map switches follow mode to false
    this.setState({ following: false });
    this.currentZoom = e.properties.zoomLevel;
  };

  handleDidFinishLoadingStyle = e => {
    this.setState({ hasFinishedLoadingStyle: true });
  };

  getFollowZoomLevel() {
    // If the user has zoomed the map, we keep to that zoom level when we switch
    // to "follow mode"
    return this.currentZoom || 12;
  }

  handleLocationPress = () => {
    const { location } = this.props;
    if (!(location.provider && location.provider.locationServicesEnabled))
      return;
    this.setState(state => ({ following: !state.following }));
  };

  render() {
    const { observations, styleURL, isFocused, location } = this.props;
    const initialCoords = this.initialPosition
      ? [
          this.initialPosition.coords.longitude,
          this.initialPosition.coords.latitude
        ]
      : [0, 0];
    const initialZoom = this.initialPosition ? 8 : 0;
    const locationServicesEnabled =
      location.provider && location.provider.locationServicesEnabled;

    return (
      <>
        {styleURL === "loading" ? (
          <Loading />
        ) : styleURL === "error" ? (
          <View style={{ flex: 1 }}>
            <Text>Error loading map</Text>
          </View>
        ) : (
          <MapboxGL.MapView
            style={{ flex: 1 }}
            ref={this.handleMapViewRef}
            maxZoomLevel={22}
            logoEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            onPress={this.handleObservationPress}
            onDidFailLoadingMap={e =>
              bugsnag.notify(e, {
                severity: "error",
                context: "onDidFailLoadingMap"
              })
            }
            onDidFinishLoadingStyle={this.handleDidFinishLoadingStyle}
            onDidFinishRenderingMap={() =>
              bugsnag.leaveBreadcrumb("onDidFinishRenderingMap")
            }
            onDidFinishRenderingMapFully={() =>
              bugsnag.leaveBreadcrumb("onDidFinishRenderingMapFully")
            }
            onWillStartLoadingMap={() =>
              bugsnag.leaveBreadcrumb("onWillStartLoadingMap")
            }
            onDidFinishLoadingMap={() =>
              bugsnag.leaveBreadcrumb("onDidFinishLoadingMap")
            }
            compassEnabled={false}
            styleURL={styleURL}
            onRegionDidChange={this.handleRegionDidChange}>
            <MapboxGL.Camera
              centerCoordinate={initialCoords}
              zoomLevel={initialZoom}
              followUserLocation={isFocused && this.state.following}
              followUserMode="normal"
              followZoomLevel={this.getFollowZoomLevel()}
              animationMode="flyTo"
              triggerKey={this.state.following}
            />
            {locationServicesEnabled && (
              <MapboxGL.UserLocation visible={isFocused} minDisplacement={15} />
            )}
            {this.state.hasFinishedLoadingStyle && (
              <ObservationMapLayer
                onPress={this.handleObservationPress}
                observations={observations}
              />
            )}
          </MapboxGL.MapView>
        )}
        <View style={styles.locationButton}>
          <IconButton onPress={this.handleLocationPress}>
            {this.state.following ? (
              <LocationFollowingIcon />
            ) : (
              <LocationNoFollowIcon />
            )}
          </IconButton>
        </View>
      </>
    );
  }
}

export default withNavigationFocus(MapView);

// Shallow compare objects, but omitting certain keys from the comparison
function shallowDiffers(a: any, b: any, omit: string[] = []) {
  for (const i in a) if (!(i in b)) return true;
  for (const i in b) {
    if (a[i] !== b[i] && omit.indexOf(i) === -1) return true;
  }
  return false;
}

const styles = StyleSheet.create({
  locationButton: {
    position: "absolute",
    right: 20,
    bottom: 20
  }
});
