package com.mapeo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.rnfs.RNFSPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.janeasystems.rn_nodejs_mobile.RNNodeJsMobilePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import expo.adapters.react.ModuleRegistryAdapter;
import expo.adapters.react.ReactAdapterPackage;
import expo.adapters.react.ReactModuleRegistryProvider;
import expo.core.interfaces.Package;
import expo.core.interfaces.SingletonModule;
import expo.modules.constants.ConstantsPackage;
import expo.modules.filesystem.FileSystemPackage;
import expo.modules.permissions.PermissionsPackage;
import expo.modules.location.LocationPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import expo.modules.camera.CameraPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(Arrays.<Package>asList(
    new ReactAdapterPackage(),
    new ConstantsPackage(),
    new PermissionsPackage(),
    new FileSystemPackage(),
    new LocationPackage(),
    new CameraPackage()
  ), Arrays.<SingletonModule>asList());

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new NetInfoPackage(),
            new AsyncStoragePackage(),
            new LinearGradientPackage(),
            new ImageResizerPackage(),
            new RNScreensPackage(),
            new RNFSPackage(),
            new ReanimatedPackage(),
          new RNGestureHandlerPackage(),
          new SplashScreenReactPackage(),
          new RNNodeJsMobilePackage(),
          new RCTMGLPackage(),
          new ModuleRegistryAdapter(mModuleRegistryProvider)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return BuildConfig.isStorybook ? "storybook-native/index" : "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
