import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoginScreen from "../app/LoginScreen";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("../app/firebase/FirebaseConfig", () => ({
  auth: { name: "mock-auth" },
}));

jest.mock("../components/AppThemeContext", () => ({
  useAppTheme: () => ({
    currentTheme: {
      background: "#ffffff",
      border: "#cccccc",
      button: "#007AFF",
      card: "#f5f5f5",
      placeholder: "#808080",
      text: "#111111",
    },
  }),
}));

describe("<LoginScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the login form correctly", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Welcome Back")).toBeTruthy();
    expect(screen.getByPlaceholderText("Enter Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Enter Password")).toBeTruthy();
    expect(screen.getByText("Login")).toBeTruthy();
  });

  test("shows an error when email and password are empty", () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByText("Login"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Please fill in all fields.",
    );
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test("logs in with Firebase and navigates to settings", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: "student@example.com" },
    });

    render(<LoginScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Enter Email"),
      " student@example.com ",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "pass1234");
    fireEvent.press(screen.getByText("Login"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        { name: "mock-auth" },
        "student@example.com",
        "pass1234",
      );
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Success",
      "You have been logged in.",
    );
    expect(router.replace).toHaveBeenCalledWith("/Setting");
  });

  test("shows a friendly message when Firebase rejects login", async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({
      code: "auth/invalid-credential",
      message: "Firebase raw error",
    });

    render(<LoginScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Enter Email"),
      "wrong@example.com",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "badpass");
    fireEvent.press(screen.getByText("Login"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Email or password is incorrect.",
      );
    });
  });
});
