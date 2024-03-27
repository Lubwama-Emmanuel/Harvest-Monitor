import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { tenth } from "@/constants/Measurements";
import { themeColor } from "@/constants/Colors";

interface ValueContainerProps {
  title: string;
  value: number;
  symbol?: string;
}

export default function ValueContainer({
  title,
  value,
  symbol,
}: ValueContainerProps) {
  const isNegative = value < 0 ? true : false;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.innerContainer}>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progress,
              {
                width: `${Math.abs((Math.ceil(value) / 200) * 100)}%`,
                backgroundColor: isNegative ? "red" : themeColor,
              },
            ]}
          />
        </View>
        <Text style={styles.value}>{`${Math.ceil(value)} ${symbol}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: tenth,
    marginVertical: tenth * 0.5,
  },
  title: {
    marginBottom: tenth * 0.6,
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressContainer: {
    height: tenth,
    backgroundColor: "#C7C8CC",
    borderRadius: 12,
    width: "85%",
  },
  progress: {
    height: "100%",
    borderRadius: 12,
  },
  value: {
    width: "15%",
    paddingLeft: tenth,
  },
});
