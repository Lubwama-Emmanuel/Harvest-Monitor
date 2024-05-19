import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { Platform } from "react-native";

import Constants from "expo-constants";
import { db } from "@/FirebaseConfig";
import { ref, onChildAdded } from "firebase/database";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      console.log("is device");
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: "882ef85e-7550-499e-b851-7cad2a32b297",
        // projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      await AsyncStorage.setItem("expoPushToken", token.data);
      return token;
    } else {
      console.log("Must use physical device for Push Notifications");
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return { expoPushToken, notification };
};

export async function sendPushNotification(
  expoPushToken: Notifications.ExpoPushToken,
  label: string
) {
  let notificationTitle = "";

  if (label === "Temperature") {
    notificationTitle = "TEMPERATURE ALERT";
  } else if (label === "Humidity") {
    notificationTitle = "HUMIDITY ALERT";
  } else if (label === "Carbondioxide") {
    notificationTitle = "CARBON DIOXIDE ALERT";
  }

  const data = `${label.split(" ")[0]} is out of range, Please check store!.`;

  const message = {
    to: expoPushToken.data,
    sound: "default",
    title: notificationTitle,
    body: data,
    data: { data },
  };

  // console.log(expoPushToken.data, message);

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    console.log(
      "Push Notification Response",
      JSON.stringify(response, null, 2)
    );
  } catch (error) {
    console.error("Error sending push notification", error);
  }
}
