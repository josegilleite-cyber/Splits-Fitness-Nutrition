const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidApiLevel(config) {
  // Update app-level build.gradle (app/build.gradle)
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      // Replace compileSdk, compileSdkVersion, targetSdk, and targetSdkVersion
      config.modResults.contents = config.modResults.contents
        .replace(/compileSdk\s*=?\s*\d+/g, 'compileSdk = 35')
        .replace(/compileSdkVersion\s*=?\s*\d+/g, 'compileSdkVersion = 35')
        .replace(/targetSdk\s*=?\s*\d+/g, 'targetSdk = 35')
        .replace(/targetSdkVersion\s*=?\s*\d+/g, 'targetSdkVersion = 35');
    }
    return config;
  });

  // Update project-level build.gradle if needed
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      // Ensure compileSdk is set at project level too
      config.modResults.contents = config.modResults.contents
        .replace(/compileSdk\s*=?\s*\d+/g, 'compileSdk = 35')
        .replace(/compileSdkVersion\s*=?\s*\d+/g, 'compileSdkVersion = 35');
    }
    return config;
  });

  return config;
};
