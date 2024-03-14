import { Animated, Platform, StyleSheet } from "react-native";
import { tenth } from "@/constants/Measurements";
import colors, { themeColor } from "@/constants/Colors";
import { Text } from "./Themed";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/Store";
import { useEffect, useRef } from "react";
import { hideNotification } from "../redux/slices/NotificationSlice";

export default function NotificationBanner() {
  const dispatch = useDispatch();
  const { visible, message } = useSelector(
    (state: RootState) => state.notification
  );
  const position = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(position, {
        toValue: 0, // Move to the top of the screen
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        // Slide up animation
        Animated.timing(position, {
          toValue: -100, // Move back off-screen
          duration: 200,
          useNativeDriver: true,
        }).start(() => dispatch(hideNotification())); // Dispatch hide action after animation
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        StyleSheet.absoluteFillObject,
        { transform: [{ translateY: position }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "android" ? tenth * 9 : tenth * 9,
    width: "100%",
    backgroundColor: themeColor,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: tenth * 2,
  },
  text: {
    color: "white",
  },
});
