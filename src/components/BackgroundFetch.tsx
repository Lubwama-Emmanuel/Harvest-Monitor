import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import { sendPushNotification } from "./usePushNotifications"; // Import your notification function
import { useGetDataQuery } from "@/src/api/firebaseApi";
import { DataType } from "@/src/types/DataType";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = "background-fetch-task";

export const checkAndSendNotifications = async (
  data: any,
  expoPushToken: Notifications.ExpoPushToken
) => {
  let latestValue: DataType | undefined;
  console.log("called again", expoPushToken);

  if (data) {
    const dataArray: DataType[] = Object.values(data);
    latestValue = dataArray.pop();
  }

  console.log("called", latestValue);
  if (latestValue) {
    if (expoPushToken) {
      if (latestValue.temp > 15) {
        await sendPushNotification(expoPushToken, "Temperature");
      }
      if (latestValue.carbondioxide > 600) {
        await sendPushNotification(expoPushToken, "Carbondioxide");
      }
      if (latestValue.humidity > 70) {
        await sendPushNotification(expoPushToken, "Humidity");
      }
    }
  }
};

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

export const registerBackgroundFetch = async () => {
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
