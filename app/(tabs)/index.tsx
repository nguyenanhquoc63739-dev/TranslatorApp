import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import * as Speech from "expo-speech";

export default function HomeScreen() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const translateText = () => {
    const cleanText = inputText.trim().toLowerCase();
    let result = "";

    if (cleanText === "hello") {
      result = "xin chào";
    } else if (cleanText === "goodbye" || cleanText === "good bye") {
      result = "tạm biệt";
    } else if (cleanText === "thank you") {
      result = "cảm ơn";
    } else if (cleanText.length === 0) {
      result = "Please enter text to translate";
    } else {
      result = "Translation not found";
    }

    setTranslatedText(result);

    if (cleanText.length > 0) {
      setHistory([`${inputText.trim()} → ${result}`, ...history]);
    }
  };

  const speakText = () => {
    if (translatedText.length > 0) {
      Speech.speak(translatedText, {
        language: "vi",
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Translator App</Text>
        <Text style={styles.subtitle}>
          English to Vietnamese translation prototype
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Enter text</Text>
        <TextInput
          style={styles.input}
          placeholder="Type English text here..."
          placeholderTextColor="#8a8f98"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <Pressable style={styles.primaryButton} onPress={translateText}>
          <Text style={styles.primaryButtonText}>Translate</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Translation result</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {translatedText || "Your translated text will appear here."}
          </Text>
        </View>

        <Pressable style={styles.secondaryButton} onPress={speakText}>
          <Text style={styles.secondaryButtonText}>Speak Translation</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Translation History</Text>
          <Pressable onPress={clearHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>

        {history.length === 0 ? (
          <Text style={styles.emptyHistory}>No translations yet.</Text>
        ) : (
          history.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyText}>{item}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#e8f1ff",
    borderBottomWidth: 1,
    borderBottomColor: "#c8d7ef",
  },

  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#374151",
    fontSize: 15,
    textAlign: "center",
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },

  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: "#111827",
    textAlignVertical: "top",
  },

  primaryButton: {
    backgroundColor: "#2f80ed",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  resultBox: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    minHeight: 65,
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#2f80ed",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  secondaryButtonText: {
    color: "#2f80ed",
    fontSize: 16,
    fontWeight: "bold",
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  clearText: {
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: 14,
  },

  emptyHistory: {
    color: "#6b7280",
    fontSize: 16,
    paddingVertical: 12,
  },

  historyItem: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  historyText: {
    fontSize: 16,
    color: "#111827",
  },
});
