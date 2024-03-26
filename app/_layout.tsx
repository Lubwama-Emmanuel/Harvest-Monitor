import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationBanner from "@/components/NotificationBanner";
import { PersistGate } from "redux-persist/integration/react";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const prepare = async () => {
      const token = await AsyncStorage.getItem("token");
      await AsyncStorage.getItem("token");
      if (token !== null) {
        setIsAuthenticated(true);
      }
      if (loaded) {
        SplashScreen.hideAsync();
      }
    };

    void prepare();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <NotificationBanner />
          <Slot />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
