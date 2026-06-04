import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { currentTheme } = useAppTheme();

  const getRegisterErrorMessage = (error) => {
    if (error.code === "auth/email-already-in-use") {
      return "This email is already registered. Please login instead.";
    }

    if (error.code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }

    if (error.code === "auth/weak-password") {
      return "Password must be at least 6 characters.";
    }

    if (error.code === "auth/operation-not-allowed") {
      return "Email/password sign up is not enabled in Firebase Authentication.";
    }

    if (error.code === "auth/network-request-failed") {
      return "Network error. Please check your internet connection and try again.";
    }

    return error.message || "Could not create account. Please try again.";
  };

  const emailRegister = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match, please try again.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, cleanEmail, password);
      Alert.alert("Success", "Your account has been created.");
      router.replace("/LoginScreen");
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Error", getRegisterErrorMessage(error));
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace("/Setting")}
      >
        <Text style={[styles.backText, { color: currentTheme.text }]}>
          Back to Settings
        </Text>
      </Pressable>

      <Text style={[styles.title, { color: currentTheme.text }]}>
        Create Account
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
        placeholder="Please Enter Email"
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
        placeholder="Please Enter Password"
        placeholderTextColor={currentTheme.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
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
        placeholder="Confirm Password"
        placeholderTextColor={currentTheme.placeholder}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, { backgroundColor: currentTheme.button }]}
        onPress={emailRegister}
      >
        <Text style={styles.buttonText}>
          Create Account
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/LoginScreen")}>
        <Text style={[styles.loginText, { color: currentTheme.text }]}>
          Already have an account? Login
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
