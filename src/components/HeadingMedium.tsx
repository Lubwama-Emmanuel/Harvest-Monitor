import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import size from "@/src/constants/Fonts";
import { Text } from "./Themed";

interface TextProps {
  style?: object;
  children: ReactNode;
}

export default function HeadingMedium({ style, children }: TextProps) {
  return <Text style={[styles.defaultStyle, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  defaultStyle: {
    fontWeight: "500",
    fontSize: size.p1,
  },
});
