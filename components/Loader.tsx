import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors, { themeColor } from "@/constants/Colors";
import { tenth } from "@/constants/Measurements";
import { Text } from "./Themed";

interface LoaderProps {
  message?: string;
}

export default function Loader({ message }: LoaderProps) {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <ActivityIndicator size="large" color={themeColor} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff66",
  },
  text: {
    marginVertical: tenth,
    color: themeColor,
  },
});
