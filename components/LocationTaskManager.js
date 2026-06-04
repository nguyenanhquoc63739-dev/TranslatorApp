import { isRunningInExpoGo } from "expo";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";

const LOCATION_TASK_NAME = "translator-background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.log("Location task error:", error);
    return;
  }

  const latestLocation = data?.locations?.[0];

  if (latestLocation) {
    console.log("Background GPS:", latestLocation.coords);
  }
});

export default function LocationTaskManager({ themeColors, themeName }) {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskStatus, setTaskStatus] = useState("Not started");

  const mapRegion = useMemo(() => {
    if (!location) {
      return null;
    }

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [location]);

  useEffect(() => {
    let subscription;
    let isMounted = true;

    if (isTracking) {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 3000,
          distanceInterval: 3,
        },
        (newLocation) => setLocation(newLocation.coords),
      )
        .then((watcher) => {
          if (isMounted) {
            subscription = watcher;
          } else {
            watcher.remove();
          }
        })
        .catch((error) => {
          console.error("Watch location error:", error);
          setTaskStatus("GPS active. Live updates could not start.");
        });
    }

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [isTracking]);

  const requestForegroundLocationPermission = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync();

    if (!foreground.granted) {
      Alert.alert("Permission needed", "Please allow location access.");
      return false;
    }

    return true;
  };

  const makeLocationActive = (coords) => {
    setLocation(coords);
    setIsTracking(true);
  };

  const startBackgroundLocationTask = async () => {
    if (isRunningInExpoGo()) {
      setTaskStatus("GPS active. Background task needs a development build.");
      return;
    }

    const taskManagerAvailable = await TaskManager.isAvailableAsync();

    if (!taskManagerAvailable) {
      setTaskStatus("GPS active. Background task needs a development build.");
      return;
    }

    const background = await Location.requestBackgroundPermissionsAsync();

    if (!background.granted) {
      setTaskStatus("GPS active. Background permission not allowed.");
      return;
    }

    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);

    if (!isRegistered) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
        foregroundService: {
          notificationTitle: "Translator GPS is active",
          notificationBody: "Location task manager is tracking your GPS.",
        },
      });
    }

    setTaskStatus("GPS and background task running");
  };

  const startLocationTask = async () => {
    setIsLoading(true);

    try {
      const hasPermission = await requestForegroundLocationPermission();

      if (!hasPermission) {
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        Alert.alert(
          "GPS is off",
          "Please turn on Location Services, then try Start GPS again.",
        );
        setTaskStatus("GPS is turned off on this device.");
        return;
      }

      setTaskStatus("Checking last known GPS...");

      const lastKnownLocation = await Location.getLastKnownPositionAsync({
        maxAge: 60000,
        requiredAccuracy: 1000,
      });

      if (lastKnownLocation?.coords) {
        makeLocationActive(lastKnownLocation.coords);
        setTaskStatus("Showing saved GPS. Refreshing current location...");
      } else {
        setTaskStatus("Getting current GPS...");
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        mayShowUserSettingsDialog: true,
      });
      makeLocationActive(currentLocation.coords);
      setTaskStatus("GPS active");

      try {
        await startBackgroundLocationTask();
      } catch (taskError) {
        console.error("Background location task error:", taskError);
        setTaskStatus("GPS active. Background task could not start.");
      }
    } catch (error) {
      console.error("Location task error:", error);
      setTaskStatus("GPS could not start.");
      Alert.alert(
        "GPS error",
        "Could not get your location. Please check permission and Location Services.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stopLocationTask = async () => {
    try {
      const taskManagerAvailable = await TaskManager.isAvailableAsync();
      const isRegistered =
        taskManagerAvailable &&
        (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME));

      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    } catch (error) {
      console.error("Stop location task error:", error);
    }

    setIsTracking(false);
    setLocation(null);
    setTaskStatus("Stopped");
    Alert.alert("Stopped", "GPS tracking has stopped.");
  };

  const accuracyRadius = Math.max(location?.accuracy ?? 50, 30);

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
        Task Manager and GPS
      </Text>
      <Text style={[styles.description, { color: themeColors.mutedText }]}>
        Start GPS tracking and show your current location on the map.
      </Text>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, { backgroundColor: themeColors.button }]}
          onPress={startLocationTask}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Starting..." : "Start GPS"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { borderColor: themeColors.border }]}
          onPress={stopLocationTask}
        >
          <Text style={[styles.secondaryButtonText, { color: themeColors.text }]}>
            Stop
          </Text>
        </Pressable>
      </View>

      {location && (
        <View style={styles.locationBox}>
          <Text style={[styles.locationText, { color: themeColors.text }]}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={[styles.locationText, { color: themeColors.text }]}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      {location ? (
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation
          userInterfaceStyle={themeName}
        >
          <Marker coordinate={location} title="Current GPS Location" />
          <Circle
            center={location}
            radius={accuracyRadius}
            strokeColor={themeColors.button}
            fillColor={`${themeColors.button}22`}
          />
        </MapView>
      ) : (
        <View style={[styles.emptyMap, { borderColor: themeColors.border }]}>
          <Text style={[styles.description, { color: themeColors.mutedText }]}>
            Start GPS to show the map.
          </Text>
        </View>
      )}

      <Text style={[styles.status, { color: themeColors.mutedText }]}>
        Status: {taskStatus}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontWeight: "bold",
  },
  locationBox: {
    marginTop: 14,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  map: {
    height: 220,
    borderRadius: 10,
    marginTop: 8,
  },
  emptyMap: {
    height: 160,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    padding: 16,
  },
  status: {
    marginTop: 12,
    fontSize: 13,
  },
});
