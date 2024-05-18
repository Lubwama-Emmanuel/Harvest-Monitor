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
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";

import { useColorScheme } from "@/components/useColorScheme";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationBanner from "@/components/NotificationBanner";
import { PersistGate } from "redux-persist/integration/react";
import { usePushNotifications } from "@/components/usePushNotifications";
import { checkAndSendNotifications } from "@/components/BackgroundFetch";
import { useGetDataQuery } from "@/api/firebaseApi";

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

const BACKGROUND_FETCH_TASK = "background-fetch-task";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const { data } = useGetDataQuery(undefined, {
    pollingInterval: 18000000,
    skipPollingIfUnfocused: true,
  });

  const expoPushToken = await AsyncStorage.getItem("expoPushToken");

  try {
    await checkAndSendNotifications(
      data,
      expoPushToken as unknown as Notifications.ExpoPushToken
    );
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error(error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const registerBackgroundFetch = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 18000, // 5 hours in seconds
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (error) {
    console.error("Failed to register background fetch task", error);
  }
};

export default function RootLayout() {
  // const { expoPushToken, notification } = usePushNotifications();

  // console.log(expoPushToken?.data, notification);
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
      registerBackgroundFetch();

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
