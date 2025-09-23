module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@components": "./components",
            "@utils": "./utils",
            "@app": "./app",
            "@assets": "./assets",
            "@shared": "./shared",
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
