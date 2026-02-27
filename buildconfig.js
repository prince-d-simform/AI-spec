/* eslint-disable require-jsdoc */
export const getEnvironmentConfig = (environment) => {
  switch (environment) {
    case 'development':
      return {
        appName: 'aispec-dev',
        bundleIdentifier: 'com.simform.aispec.dev'
      };
    case 'preview':
      return {
        appName: 'aispec-preview',
        bundleIdentifier: 'com.simform.aispec.preview'
      };
    case 'production':
    default:
      return {
        appName: 'aispec',
        bundleIdentifier: 'com.simform.aispec'
      };
  }
};

/**
 * Define proguard rules for React Native and related libraries.
 * @param {string} packageID - The application package identifier.
 * @returns {string} The proguard rules as a string.
 */
export const defineProGuardRules = (bundleIdentifier) => `-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keep @com.facebook.proguard.annotations.DoNotStripAny class * {
    *;
}
-keep @com.facebook.jni.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.jni.annotations.DoNotStrip *;
}
-keep @com.facebook.jni.annotations.DoNotStripAny class * {
    *;
}

-keep class * implements com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * implements com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

-dontwarn com.facebook.react.**
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }
-keep,includedescriptorclasses class com.facebook.react.turbomodule.core.** { *; }
-keep,includedescriptorclasses class com.facebook.react.internal.turbomodule.core.** { *; }

# hermes
-keep class com.facebook.jni.** { *; }

# okhttp

-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# okio

#noinspection ShrinkerUnresolvedReference
-keep class sun.misc.Unsafe { *; }
-dontwarn java.nio.file.*
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okio.**

# yoga
-keep,allowobfuscation @interface com.facebook.yoga.annotations.DoNotStrip
-keep @com.facebook.yoga.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.yoga.annotations.DoNotStrip *;
}

# react-native-config
-keep class ${bundleIdentifier}.BuildConfig { *; }`;