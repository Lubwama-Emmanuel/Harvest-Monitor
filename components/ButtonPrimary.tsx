import { Pressable, StyleSheet } from "react-native";
import { type ReactNode } from "react";
import colors, { themeColor } from "@/constants/Colors";
import { tenth } from "@/constants/Measurements";
import { Text } from "./Themed";

interface ButtonPrimaryProps {
  children: ReactNode;
  onPressFunction?: () => void;
  disabled?: boolean;
}

export default function ButtonPrimary({
  children,
  onPressFunction,
  disabled,
}: ButtonPrimaryProps) {
  return (
    <Pressable
      onPress={onPressFunction}
      disabled={disabled}
      style={[styles.container, (disabled ?? false) && styles.disabled]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: tenth,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeColor,
    marginHorizontal: tenth * 0.5,
    marginVertical: tenth,
    flexGrow: 1,
    // width: "100%",
  },
  text: { fontSize: 18, fontWeight: "700", color: colors.light.background },
  disabled: {
    opacity: 0.7,
  },
});
