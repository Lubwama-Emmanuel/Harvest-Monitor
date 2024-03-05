import { Dimensions, StyleSheet } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import { Text, View } from "@/components/Themed";
import { tenth } from "@/constants/Measurements";
import { height, width } from "@/constants/Dimension";
import { themeColor } from "@/constants/Colors";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text>Overall Chart</Text>
      <ProgressChart
        data={{
          labels: ["Temp", "Hum", "CH4"], // optional
          data: [0.4, 0.6, 0.8],
        }}
        strokeWidth={24}
        radius={36}
        width={width * 0.95} // from react-native
        height={height * 0.25}
        chartConfig={{
          backgroundColor: themeColor,
          backgroundGradientFrom: themeColor,
          backgroundGradientTo: themeColor,
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <Text>Temperature Chart</Text>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={width * 0.95} // from react-native
        height={height * 0.25}
        yAxisSuffix="deg"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: themeColor,
          backgroundGradientFrom: themeColor,
          backgroundGradientTo: themeColor,
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "7",
            strokeWidth: "2",
            stroke: themeColor,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <Text>Humidity Chart</Text>

      <BarChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={width * 0.95} // from react-native
        height={height * 0.25}
        yAxisSuffix="deg"
        yAxisLabel="" // optional, defaults to 1
        chartConfig={{
          backgroundColor: themeColor,
          backgroundGradientFrom: themeColor,
          backgroundGradientTo: themeColor,
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
