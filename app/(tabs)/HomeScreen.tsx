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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../components/AppThemeContext";

export default function HomeScreen() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const insets = useSafeAreaInsets();
  const { currentTheme } = useAppTheme();

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
      style={[styles.page, { backgroundColor: currentTheme.background }]}
      contentContainerStyle={[
        styles.pageContent,
        {
          paddingTop: insets.top + 28,
          paddingBottom: insets.bottom + 24,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: currentTheme.text }]}>
          Translator App
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme.mutedText }]}>
          English to Vietnamese translation with speech for Vietnamese version
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          Enter text
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentTheme.background,
              borderColor: currentTheme.border,
              color: currentTheme.text,
            },
          ]}
          placeholder="Type English text here..."
          placeholderTextColor={currentTheme.placeholder}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <Pressable
          style={[
            styles.primaryButton,
            { backgroundColor: currentTheme.button },
          ]}
          onPress={translateText}
        >
          <Text style={styles.primaryButtonText}>Translate</Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          Translation result
        </Text>
        <View
          style={[
            styles.resultBox,
            {
              backgroundColor: currentTheme.background,
              borderColor: currentTheme.border,
            },
          ]}
        >
          <Text style={[styles.resultText, { color: currentTheme.text }]}>
            {translatedText || "Your translated text will appear here."}
          </Text>
        </View>

        <Pressable
          style={[
            styles.secondaryButton,
            {
              backgroundColor: currentTheme.button,
              borderColor: currentTheme.border,
            },
          ]}
          onPress={speakText}
        >
          <Text style={styles.secondaryButtonText}>Speak Translation</Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
          },
        ]}
      >
        <View style={styles.historyHeader}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            Translation History
          </Text>
          <Pressable onPress={clearHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.historyScroll}
          showsVerticalScrollIndicator={true}
        >
          {history.length === 0 ? (
            <Text style={[styles.emptyHistory, { color: currentTheme.mutedText }]}>
              No translations yet.
            </Text>
          ) : (
            history.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.historyItem,
                  {
                    backgroundColor: currentTheme.background,
                    borderColor: currentTheme.border,
                  },
                ]}
              >
                <Text style={[styles.historyText, { color: currentTheme.text }]}>
                  {item}
                </Text>
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
  },

  pageContent: {
    paddingHorizontal: 20,
  },

  header: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },

  content: {
    padding: 16,
  },

  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    minHeight: 90,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 20,
  },

  primaryButton: {
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
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
  },

  resultText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  secondaryButton: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
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
    fontSize: 16,
    paddingVertical: 12,
  },

  historyScroll: {
    maxHeight: 220,
    marginTop: 6,
  },

  historyItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },

  historyText: {
    fontSize: 16,
  },
});
