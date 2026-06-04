import { isRunningInExpoGo } from "expo";
import { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function AdBanner() {
  useEffect(() => {
    if (Platform.OS !== "android" || isRunningInExpoGo()) {
      return;
    }

    const mobileAds = require("react-native-google-mobile-ads").default;
  }, []);

  if (Platform.OS !== "android" || isRunningInExpoGo()) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          AdMob test banner appears in the Android APK build.
        </Text>
      </View>
    );
  }

  const { BannerAd, BannerAdSize } = require("react-native-google-mobile-ads");
  const androidTestBannerId = "ca-app-pub-3940256099942544/6300978111";

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={androidTestBannerId}
        size={BannerAdSize.BANNER}
        onAdFailedToLoad={(error) => {
          console.log("AdMob banner error:", error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  placeholder: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  placeholderText: {
    color: "#777777",
    fontSize: 12,
  },
});
