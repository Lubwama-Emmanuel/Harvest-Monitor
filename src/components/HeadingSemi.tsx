import { type ReactNode } from "react";
import { Text, StyleSheet } from "react-native";
import size from "@/src/constants/Fonts";

interface TextProps {
  style?: object;
  children: ReactNode;
}

export default function HeadingSemi({ style, children }: TextProps) {
  return <Text style={[styles.defaultStyle, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  defaultStyle: {
    fontSize: size.p1,
    fontWeight: "700",
  },
});
