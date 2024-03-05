import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Text } from "./Themed";

interface TextProps {
  style?: object;
  children: ReactNode;
}

export default function HeadingText({ style, children }: TextProps) {
  return <Text style={[styles.defaultStyle, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  defaultStyle: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 10,
  },
});
