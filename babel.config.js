module.exports = {
  presets: [
    "module:metro-react-native-babel-preset",
    [
      "@babel/preset-typescript",
      {
        isTSX: true,
        allExtensions: true,
      },
    ],
  ],
};
