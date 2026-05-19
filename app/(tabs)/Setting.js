import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import BatteryInfo from "./BatteryInfo";
import { Colors, defaultTheme } from "./ThemeColor";

export default function SettingScreen() {
  const [theme, setTheme] = useState(defaultTheme);
  const currentTheme = Colors[theme];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.heading, { color: currentTheme.text }]}>
        Settings
      </Text>

      <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          Appearance
        </Text>
        <Text style={[styles.description, { color: currentTheme.text }]}>
          Choose the app theme manually.
        </Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={[
              styles.themeButton,
              {
                backgroundColor:
                  theme === "light" ? currentTheme.button : "#cccccc",
              },
            ]}
            onPress={() => setTheme("light")}
          >
            <Text style={styles.buttonText}>Light Mode</Text>
          </Pressable>

          <Pressable
            style={[
              styles.themeButton,
              {
                backgroundColor:
                  theme === "dark" ? currentTheme.button : "white",
              },
            ]}
            onPress={() => setTheme("dark")}
          >
            <Text style={styles.buttonText}>Dark Mode</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          Device Information
        </Text>
        <BatteryInfo />
      </View>

      <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          Notifications
        </Text>
        <Text style={[styles.description, { color: currentTheme.text }]}>
          Study reminder notifications will be added here later.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  themeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
