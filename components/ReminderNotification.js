import * as Notifications from "expo-notifications";
import { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

const HISTORY_REMINDER_SECONDS = 180;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function ReminderNotification({ themeColors }) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledId, setScheduledId] = useState(null);

  const prepareNotificationPermissions = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("reminders", {
        name: "Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const permission = await Notifications.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow notifications.");
      return false;
    }

    return true;
  };

  const scheduleHistoryReminder = async () => {
    setIsScheduling(true);

    try {
      const hasPermission = await prepareNotificationPermissions();

      if (!hasPermission) {
        return;
      }

      if (scheduledId) {
        await Notifications.cancelScheduledNotificationAsync(scheduledId);
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Check Translation History",
          body: "You have used the app for 3 minutes. Review your translated history now.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: HISTORY_REMINDER_SECONDS,
          repeats: true,
          channelId: "reminders",
        },
      });

      setScheduledId(id);
      Alert.alert(
        "Success",
        "You will be reminded to check translation history every 3 minutes.",
      );
    } catch (error) {
      console.error("Notification error:", error);
      Alert.alert("Error", "Could not schedule the history reminder.");
    } finally {
      setIsScheduling(false);
    }
  };

  const cancelHistoryReminder = async () => {
    try {
      if (scheduledId) {
        await Notifications.cancelScheduledNotificationAsync(scheduledId);
      }

      setScheduledId(null);
      Alert.alert("Cancelled", "History reminder has been cancelled.");
    } catch (error) {
      console.error("Cancel notification error:", error);
      Alert.alert("Error", "Could not cancel the history reminder.");
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        Study Reminder
      </Text>
      <Text style={[styles.description, { color: themeColors.mutedText }]}>
        Remind the user every 3 minutes to check translated history.
      </Text>

      <Pressable
        style={[styles.button, { backgroundColor: themeColors.button }]}
        onPress={scheduleHistoryReminder}
        disabled={isScheduling}
      >
        <Text style={styles.buttonText}>
          {isScheduling ? "Scheduling..." : "Start 3 Minute Reminders"}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, { borderColor: themeColors.border }]}
        onPress={cancelHistoryReminder}
      >
        <Text style={[styles.secondaryButtonText, { color: themeColors.text }]}>
          Cancel Reminder
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontWeight: "bold",
  },
});
