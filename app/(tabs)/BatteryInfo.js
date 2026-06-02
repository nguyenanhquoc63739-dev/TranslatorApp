import {
  BatteryState,
  useBatteryLevel,
  useBatteryState,
  useLowPowerMode,
} from "expo-battery";
import { StyleSheet, Text, View } from "react-native";

export default function BatteryInfo() {
  const batteryLevel = useBatteryLevel();
  const batteryState = useBatteryState();
  const lowPowerMode = useLowPowerMode();

  const batteryPercent =
    batteryLevel >= 0 ? Math.round(batteryLevel * 100) + "%" : "Unknown";

  const getBatteryStateText = () => {
    if (batteryState === BatteryState.UNPLUGGED) return "Unplugged";
    if (batteryState === BatteryState.CHARGING) return "Charging";
    if (batteryState === BatteryState.FULL) return "Full";
    return "Unknown";
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Device Battery Information</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Battery Level</Text>
        <Text style={styles.value}>{batteryPercent}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Battery State</Text>
        <Text style={styles.value}>{getBatteryStateText()}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Low Power Mode</Text>
        <Text style={styles.value}>{lowPowerMode ? "On" : "Off"}</Text>
      </View>

      <Text style={styles.note}>
        This information is collected from the device using Expo Battery.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f5f7fa",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
  },
  note: {
    fontSize: 13,
    marginTop: 10,
    color: "#555",
  },
});
