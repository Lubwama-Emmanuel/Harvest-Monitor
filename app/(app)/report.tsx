import { Text, View } from "@/components/Themed";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function Report() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text>Generate Report</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
