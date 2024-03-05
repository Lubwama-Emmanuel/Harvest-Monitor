import { StyleSheet, TouchableOpacity } from "react-native";
import HeadingMedium from "./HeadingMedium";
import { type ReactNode } from "react";
import colors, { themeColor } from "@/constants/Colors";
import size from "@/constants/Fonts";

interface PressableTextProps {
  children: ReactNode;
  onPressFunction?: () => void;
}

export default function PressableText({
  children,
  onPressFunction,
}: PressableTextProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressFunction}>
      <HeadingMedium style={styles.text}>{children}</HeadingMedium>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: themeColor,
    fontWeight: "800",
    fontSize: size.p1,
  },
});
