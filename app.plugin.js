const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidApiLevel(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      // Replace compileSdkVersion and targetSdkVersion
      config.modResults.contents = config.modResults.contents
        .replace(/compileSdkVersion\s*=?\s*\d+/g, 'compileSdkVersion = 35')
        .replace(/targetSdkVersion\s*=?\s*\d+/g, 'targetSdkVersion = 35');
    }
    return config;
  });
};
