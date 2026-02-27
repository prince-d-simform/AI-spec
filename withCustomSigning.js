const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Modifies Gradle files to apply custom signing configurations for Android builds.
 *
 * This function generates and writes a custom signing Gradle script (`custom-signing.gradle`)
 * using credentials from `credentialsNew.json` located in the project root. It also modifies
 * the `build.gradle` file to include this custom signing script if not already included.
 *
 * @param {string} projectRoot - The root directory of the project.
 * @param {object} config - The configuration object, potentially containing additional settings.
 *
 * @throws {Error} If the `credentialsNew.json` file is not found at the expected location.
 *
 * This function creates dynamic signing configurations for each environment specified
 * in the `credentialsNew.json` file and ensures that the release build type uses the
 * appropriate signing configuration.
 */
function modifyGradleFiles(projectRoot, config) {
  const androidAppPath = path.join(projectRoot, "android", "app");
  const signingFilePath = path.join(androidAppPath, "custom-signing.gradle");
  const buildGradlePath = path.join(androidAppPath, "build.gradle");

  // Custom signing config content
  const signingConfigContent = `
    import java.nio.file.Paths
    import groovy.json.JsonSlurper

    // Read and parse credentials.json from project root
    def credentialsFile = new File(rootProject.file("../credentials.json").absolutePath)

    if (!credentialsFile.exists()) {
        throw new GradleException("Missing credentials.json at project root: $credentialsFile.absolutePath")
    }

    def credentials = new JsonSlurper().parse(credentialsFile)

    // Create dynamic signing configs for each environment
    android.signingConfigs {
        // Keep existing debug config
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        def envConfig = credentials.android.keystore
        release {
            def resolvedKeystorePath = Paths.get(envConfig.keystorePath)
            def storeFilePath = resolvedKeystorePath.isAbsolute() ? 
                resolvedKeystorePath : 
                rootProject.file("..").toPath().resolve(resolvedKeystorePath)
            
            storeFile storeFilePath.toFile()
            storePassword envConfig.keystorePassword
            keyAlias envConfig.keyAlias
            keyPassword envConfig.keyPassword ?: envConfig.keystorePassword
            
            println "Configured signing for environment: release with keystore: $storeFilePath"
        }
    }

    android.buildTypes {
        release {
            def defaultSigning = android.signingConfigs.findByName("release") ?: signingConfigs.debug
            signingConfig defaultSigning
        }
    }

    println "Custom signing configuration applied successfully"
`;

  // Write custom-signing.gradle
  fs.writeFileSync(signingFilePath, signingConfigContent);
  console.log("✓ Created custom-signing.gradle");

  // Modify build.gradle
  let buildGradleContent = fs.readFileSync(buildGradlePath, "utf8");

  if (!buildGradleContent.includes(`apply from: "./custom-signing.gradle"`)) {
    buildGradleContent = buildGradleContent.replace(
      /apply plugin: "com.android.application"/,
      `apply plugin: "com.android.application"\napply from: "./custom-signing.gradle"`
    );
    fs.writeFileSync(buildGradlePath, buildGradleContent);
    console.log("Modified build.gradle to include custom-signing.gradle");
  } else {
    console.log("build.gradle already includes custom-signing.gradle");
  }
}

/**
 * Modifies the android build config to use a custom signing configuration.
 * This is necessary because the default signing configuration is not compatible with the android signing
 * process used by the android build process.
 *
 * @param {Object} config - The modified config object.
 * @returns {Object} - The modified config object.
 */
const withCustomSigning = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      modifyGradleFiles(config.modRequest.projectRoot, config);
      return config;
    },
  ]);
};

module.exports = withCustomSigning;
