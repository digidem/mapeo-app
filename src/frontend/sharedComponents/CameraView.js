// @flow
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import debug from "debug";
import { DeviceMotion } from "expo-sensors";
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";

import AddButton from "./AddButton";
import withNavigationFocus from "../lib/withNavigationFocus";
import PermissionsContext, {
  PERMISSIONS,
  RESULTS
} from "../context/PermissionsContext";
import type { CapturePromise } from "../context/DraftObservationContext";

const log = debug("CameraView");

const captureQuality = 75;
const captureOptions = {
  base64: false,
  exif: true,
  skipProcessing: true
};

// Little helper to timeout a promise
function promiseTimeout(promise: Promise<any>, ms: number, msg?: string) {
  let timeoutId: TimeoutID;
  const timeout = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(msg || "Timeout after " + ms + "ms"));
    }, ms);
  });
  promise.finally(() => clearTimeout(timeoutId));
  return Promise.race([promise, timeout]);
}

type Props = {
  // Called when the user takes a picture, with a promise that resolves to an
  // object with the property `uri` for the captured (and rotated) photo.
  onAddPress: (e: any, capture: CapturePromise) => void,
  // When `isFocused` is false, the camera is unmounted. This needs to happen
  // because otherwise the camera does not show when you navigate back to the
  // camera screen.
  isFocused: boolean
};

type State = {
  takingPicture: boolean,
  showCamera: boolean
};

type Acceleration = { x: number, y: number, z: number };

class CameraView extends React.Component<Props, State> {
  cameraRef: { current: any };
  subscription: { remove: () => any };
  acceleration: Acceleration;
  state = { takingPicture: false, showCamera: true };

  constructor(props: Props) {
    super(props);
    this.cameraRef = React.createRef();
  }

  componentDidMount() {
    DeviceMotion.isAvailableAsync().then(motionAvailable => {
      if (!motionAvailable) return;
      DeviceMotion.setUpdateInterval(1000);
      this.subscription = DeviceMotion.addListener(motion => {
        this.acceleration = motion.accelerationIncludingGravity;
      });
    });
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.remove();
  }

  handleAddPress = (e: any) => {
    const camera = this.cameraRef.current;
    if (!camera) return log("Camera view not ready");
    if (this.state.takingPicture) return log("Shutter pressed twice");
    log("Start photo capture");
    const capture = promiseTimeout(
      camera.takePictureAsync(captureOptions),
      15000,
      "Error capturing photo"
    ).then(data => {
      log("Initial capture");
      return rotatePhoto(this.acceleration)(data);
    });
    this.setState(
      {
        takingPicture: true
      },
      () => {
        // Slight weirdness with a expo-camera bug: if we navigate away straight
        // away then the capture promise never resolves.
        setTimeout(this.props.onAddPress, 0, e, capture);
      }
    );
    capture.finally(() => {
      this.setState({ takingPicture: false });
    });
  };

  render() {
    const { takingPicture } = this.state;
    return (
      <PermissionsContext.Consumer>
        {({ permissions }) => {
          if (permissions[PERMISSIONS.CAMERA] !== RESULTS.GRANTED)
            return <Text>No access to camera</Text>;
          return (
            <View style={styles.container}>
              {this.props.isFocused && (
                <>
                  <Camera
                    ref={this.cameraRef}
                    style={{ flex: 1 }}
                    type={Camera.Constants.Type.back}
                    useCamera2Api={false}
                  />
                  <AddButton
                    onPress={this.handleAddPress}
                    style={{ opacity: takingPicture ? 0.5 : 1 }}
                  />
                </>
              )}
            </View>
          );
        }}
      </PermissionsContext.Consumer>
    );
  }
}

export default withNavigationFocus(CameraView);

// Rotate the photo to match device orientation
function rotatePhoto(acc: Acceleration) {
  const rotation = getPhotoRotation(acc);
  return function({ uri, exif, width, height }) {
    const originalUri = uri;
    let resizedUri;
    const resizePromise = ImageResizer.createResizedImage(
      uri,
      width,
      height,
      "JPEG",
      captureQuality,
      rotation
    )
      .then(({ uri }) => {
        log("Rotated photo");
        // Image resizer uses `JPEG` as the extension, which gets passed through
        // to mapeo-core media store. Change to `jpg` to match legacy photos and
        // avoid issues on Windows (don't know if it recognizes `JPEG`)
        resizedUri = uri.replace(/\.JPEG$/, ".jpg");
        return RNFS.moveFile(uri, resizedUri);
      })
      .then(() => {
        log("Renamed captured photo");
        return { uri: resizedUri };
      });
    // Cleanup the original image even if there is an error
    resizePromise.finally(() => {
      RNFS.unlink(originalUri).then(() => log("Cleaned up un-rotated photo"));
    });
    return resizePromise;
  };
}

const GRAVITY_AT_45_DEG = Math.sin(Math.PI / 4) * 9.81;

// Use the accelerometer to calculate the photo rotation, rotating as the user
// would expect based on the angle of the screen.
function getPhotoRotation({ x, y, z }: Acceleration) {
  let rotation = 0;
  if (z < -GRAVITY_AT_45_DEG || z > GRAVITY_AT_45_DEG) {
    // camera is pointing up or down
    if (Math.abs(y) > Math.abs(x)) {
      // camera is vertical
      if (y <= 0) rotation = 0;
      else rotation = 180;
    } else {
      // camera is horizontal
      if (x >= 0) rotation = 90;
      else rotation = -90;
    }
  } else if (x > -GRAVITY_AT_45_DEG && x < GRAVITY_AT_45_DEG) {
    // camera is vertical
    if (y <= 0) rotation = 0;
    else rotation = 180;
  } else {
    // camera is horizontal
    if (x >= 0) rotation = 90;
    else rotation = -90;
  }
  return rotation;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
});
