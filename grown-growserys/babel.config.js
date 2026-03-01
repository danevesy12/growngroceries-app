module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // Add any other plugins you use here
        'react-native-reanimated/plugin', // ⚠ Must be last
      ],
    };
  };
  