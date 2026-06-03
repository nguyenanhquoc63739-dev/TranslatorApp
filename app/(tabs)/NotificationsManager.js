import { ScrollView, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../components/AppThemeContext";
import LocationTaskManager from "../../components/LocationTaskManager";
import ReminderNotification from "../../components/ReminderNotification";

export default function NotificationManager() {
  const insets = useSafeAreaInsets();
  const { theme, currentTheme } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 28,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <Text style={[styles.heading, { color: currentTheme.text }]}>
        Notifications
      </Text>
      <ReminderNotification themeColors={currentTheme} />
      <LocationTaskManager themeColors={currentTheme} themeName={theme} />
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
    marginBottom: 16,
  },
});
