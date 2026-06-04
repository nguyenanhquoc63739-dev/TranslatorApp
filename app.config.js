const appJson = require("./app.json");

const googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const androidConfig = googleMapsApiKey
  ? {
      ...appJson.expo.android.config,
      googleMaps: {
        ...appJson.expo.android.config?.googleMaps,
        apiKey: googleMapsApiKey,
      },
    }
  : appJson.expo.android.config;

const plugins = [
  ...appJson.expo.plugins,
  [
    "expo-camera",
    {
      cameraPermission:
        "Allow Translator to use the camera to scan barcodes.",
      recordAudioAndroid: false,
      barcodeScannerEnabled: true,
    },
  ],
  [
    "react-native-google-mobile-ads",
    {
      androidAppId: "ca-app-pub-3940256099942544~3347511713",
    },
  ],
];

module.exports = {
  ...appJson.expo,
  plugins,
  android: {
    ...appJson.expo.android,
    config: androidConfig,
  },
};
