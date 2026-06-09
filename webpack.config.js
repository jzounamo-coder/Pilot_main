const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.devServer = {
    ...config.devServer,
    proxy: {
      '/api': {
        target: 'https://control-api1.speedpro.cg',
        changeOrigin: true,
        secure: false,
      }
    }
  };
  return config;
};
