import { Dimensions, StyleSheet } from "react-native";
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit";
import * as Notification from "expo-notifications";

import { ScrollView, Text, View } from "@/components/Themed";
import { tenth } from "@/constants/Measurements";
import { height, width } from "@/constants/Dimension";
import { themeColor } from "@/constants/Colors";
import { useGetDataQuery } from "@/api/firebaseApi";
import Loader from "@/components/Loader";
import ValueContainer from "@/components/ValueContainer";

// Main screens
export default function TabOneScreen() {
  const { data, isError, isLoading } = useGetDataQuery();

  async function scheduleNotificationHandler() {
    await Notification.scheduleNotificationAsync({
      content: {
        title: "My first notification!",
        body: "This is its body",
      },
      trigger: {
        seconds: 5,
      },
    });
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: tenth * 10,
      }}
    >
      <View style={styles.overAllChart}>
        <ValueContainer
          title="Temparature"
          value={Number(data?.temp)}
          symbol="°C"
        />
        <ValueContainer
          title="Humidity"
          value={Number(data?.humidity)}
          symbol="%"
        />
        <ValueContainer
          title="Methane"
          value={Number(data?.methane)}
          symbol=""
        />
      </View>

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

      <Text>Methane Chart</Text>
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
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  overAllChart: {
    marginVertical: tenth,
  },
});
