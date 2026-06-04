import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";

const getHistoryCollection = (userId) =>
  collection(db, "users", userId, "translationHistory");

export const saveHistoryItem = (userId, originalText, translatedText) =>
  addDoc(getHistoryCollection(userId), {
    originalText,
    translatedText,
    createdAt: serverTimestamp(),
  });

export const listenToHistory = (userId, onHistoryChange, onError) => {
  const historyQuery = query(
    getHistoryCollection(userId),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    historyQuery,
    (snapshot) => {
      const historyItems = snapshot.docs.map((historyDoc) => {
        const data = historyDoc.data();

        return {
          id: historyDoc.id,
          originalText: data.originalText || "",
          translatedText: data.translatedText || "",
        };
      });

      onHistoryChange(historyItems);
    },
    onError,
  );
};

export const clearHistoryItems = (userId, historyItems) =>
  Promise.all(
    historyItems.map((item) =>
      deleteDoc(doc(db, "users", userId, "translationHistory", item.id)),
    ),
  );
