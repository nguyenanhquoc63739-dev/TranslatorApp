import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAppTheme } from "../components/AppThemeContext";
import { auth } from "./firebase/FirebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentTheme } = useAppTheme();

  const getLoginErrorMessage = (error) => {
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      return "Email or password is incorrect.";
    }

    if (error.code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }

    if (error.code === "auth/network-request-failed") {
      return "Network error. Please check your internet connection and try again.";
    }

    return error.message || "Could not login. Please try again.";
  };

  const emailLogin = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      Alert.alert("Success", "You have been logged in.");
      router.replace("/HomeScreen");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", getLoginErrorMessage(error));
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Text style={[styles.title, { color: currentTheme.text }]}>
        Welcome Back
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
            color: currentTheme.text,
          },
        ]}
        placeholder="Enter Email"
        placeholderTextColor={currentTheme.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
            color: currentTheme.text,
          },
        ]}
        placeholder="Enter Password"
        placeholderTextColor={currentTheme.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[styles.button, { backgroundColor: currentTheme.button }]}
        onPress={emailLogin}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/RegisterScreen")}>
        <Text style={[styles.registerText, { color: currentTheme.text }]}>
          {"Don't have an account? Register"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
