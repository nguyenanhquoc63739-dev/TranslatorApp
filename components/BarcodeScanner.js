import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BarcodeScanner({ themeColors }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        return;
      }
    }

    setScannedResult(null);
    setIsScannerOpen(true);
  };

  const handleBarcodeScanned = (result) => {
    setScannedResult(result);
    setIsScannerOpen(false);
  };

  return (
    <View>
      <Text style={[styles.description, { color: themeColors.mutedText }]}>
        Scan a QR code or barcode with the phone camera.
      </Text>

      {isScannerOpen ? (
        <View style={[styles.scannerFrame, { borderColor: themeColors.border }]}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
          />
        </View>
      ) : (
        <View style={[styles.emptyScanner, { borderColor: themeColors.border }]}>
          <Text style={[styles.description, { color: themeColors.mutedText }]}>
            Camera preview is closed.
          </Text>
        </View>
      )}

      {scannedResult && (
        <View style={[styles.resultBox, { borderColor: themeColors.border }]}>
          <Text style={[styles.resultLabel, { color: themeColors.text }]}>
            Scanned Data
          </Text>
          <Text style={[styles.resultText, { color: themeColors.mutedText }]}>
            {scannedResult.data}
          </Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, { backgroundColor: themeColors.button }]}
          onPress={openScanner}
        >
          <Text style={styles.buttonText}>
            {isScannerOpen ? "Scanning..." : "Start Scanner"}
          </Text>
        </Pressable>

        {isScannerOpen && (
          <Pressable
            style={[styles.secondaryButton, { borderColor: themeColors.border }]}
            onPress={() => setIsScannerOpen(false)}
          >
            <Text
              style={[styles.secondaryButtonText, { color: themeColors.text }]}
            >
              Close
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 15,
    marginBottom: 12,
  },
  scannerFrame: {
    height: 260,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  camera: {
    flex: 1,
  },
  emptyScanner: {
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginBottom: 12,
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 10,
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
});
