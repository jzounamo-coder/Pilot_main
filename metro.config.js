const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'react-native-maps' || moduleName.includes('react-native-maps')) {
      return { type: 'empty' };
    }
    if (moduleName === 'react-native-image-viewing' || moduleName.includes('react-native-image-viewing')) {
      return { type: 'empty' };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
