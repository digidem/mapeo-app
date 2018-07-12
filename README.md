# Mapeo Mobile

An Android app for offline participatory mapping, by Digital Democracy.

## Contributing

This is a React Native project, making use of [react-native-node](https://github.com/staltz/react-native-node) for running a Node.js background process.

### Setup

- Make sure you have installed all React Native dependencies for Android development on your operating system, follow [these official instructions](http://facebook.github.io/react-native/docs/getting-started.html)
- `yarn` to install dependencies
- Have an Android device (not emulator, due to the Node.js background process built for ARM architectures) with developer mode enabled
- Acquire a MapBox access token (make an account and sign in) then insert the accessToken into the `env.json` file (not tracked in Git, but a skeleton is provided in the repo): `{"accessToken":"YOUR_MAPBOX_ACCESS_TOKEN"}`

### Debugging

- Install [react-native-debugger](https://github.com/jhen0409/react-native-debugger), kill Metro if you have it running, and start it with `npm run start:debugger` (this will start metro with the ENV set to launch the debugger)
- After launching the app with `npm run android` open react-native-debugger and on the phone open the dev menu (by shaking it) and enable remote debugging
- react-native debugger should show you redux actions, the react component heirarchy, and the console log and dev tools from Chrome.
- To debug the node process run logcat with `npm run logcat`. This will give you console and error output from rnnode. Note that when you make changes to anything in rnnode you will have to run `npm run build-rnnodeapp` *and* uninstall the debug app from the phone and reinstall with `npm run android`.

### Compile

- Execute `npm run build-rnnodeapp` to compile the Node.js background project. It should create the folder `./rnnodeapp`
- `npm run android` will compile the Android/Java project and install the APK on the USB-connected device

### Generate Release APK

In `mapeo-mobile/android/app` run

```
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

and then in `mapeo-mobile/android` run

```
./gradlew assembleRelease
```

### Benchmarks and low-level tests

Low-level library tests run a benchmarks-only background Node.js process in the Android device, and use Appium with `wd` to verify the results on-screen.

```
npm run benchmark
```
