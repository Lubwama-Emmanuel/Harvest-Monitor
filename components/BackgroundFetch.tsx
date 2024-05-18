import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import {
  sendPushNotification,
  usePushNotifications,
} from "./usePushNotifications"; // Import your notification function
import { useGetDataQuery } from "@/api/firebaseApi";
import { DataType } from "@/types/DataType";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
