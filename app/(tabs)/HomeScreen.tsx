import * as Speech from "expo-speech";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const translateText = async () => {
    const cleanText = inputText.trim();

    if (cleanText.length === 0) {
      setTranslatedText("Please enter text to translate....");
      return;
    }

    setTranslatedText("Translate loading...");

    try {
      const query = new URLSearchParams({
        q: cleanText,
        langpair: "en|vi",
      });
      const response = await fetch(
        `https://api.mymemory.translated.net/get?${query}`,
      );
      const data = await response.json();
      console.log("MyMemory response:", data);

      if (response.ok && data.responseStatus === 200) {
        const result = data.responseData?.translatedText;

        if (!result) {
          setTranslatedText("Translation failed. Please try again.");
          return;
        }

        setTranslatedText(result);

        setHistory((oldHistory) => [`${cleanText} → ${result}`, ...oldHistory]);
      } else {
        setTranslatedText(
          data.responseDetails || "Translation failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("An error occurred. Please try again.");
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
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.pageContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Translator App</Text>
        <Text style={styles.subtitle}>
          English to Vietnamese translation with speech for Vietnamese version
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Enter text</Text>
        <TextInput
          style={styles.input}
          placeholder="Type English text here..."
          placeholderTextColor="gray"
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

        <ScrollView
          style={styles.historyScroll}
          showsVerticalScrollIndicator={true}
        >
          {history.length === 0 ? (
            <Text style={styles.emptyHistory}>No translations yet.</Text>
          ) : (
            history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyText}>{item}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },

  pageContent: {
    paddingBottom: 30,
  },

  header: {
    paddingTop: 80,
    paddingHorizontal: 30,
    paddingBottom: 30,
    backgroundColor: "lightblue",
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },

  title: {
    color: "black",
    fontSize: 40,
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "white",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },

  input: {
    minHeight: 90,
    borderWidth: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 20,
    color: "black",
  },

  primaryButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  resultBox: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "lightgray",
  },

  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "white",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "black",
  },

  secondaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  clearText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },

  emptyHistory: {
    color: "gray",
    fontSize: 16,
    paddingVertical: 12,
  },

  historyScroll: {
    maxHeight: 220,
    marginTop: 6,
  },

  historyItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "lightgray",
  },

  historyText: {
    fontSize: 16,
    color: "black",
  },
});
