package com.mapeo;

import android.content.pm.ApplicationInfo;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class AppInfoModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  AppInfoModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "AppInfo";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    ApplicationInfo ai = getReactApplicationContext().getApplicationInfo();
    constants.put("sourceDir", ai.sourceDir);
    return constants;
  }
}
