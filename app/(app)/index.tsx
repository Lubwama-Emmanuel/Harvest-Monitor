import { Pressable, StyleSheet, Switch } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Link } from "expo-router";

import { ScrollView, Text, View } from "@/components/Themed";
import { tenth } from "@/constants/Measurements";
import { height, width } from "@/constants/Dimension";
import Colors, { themeColor } from "@/constants/Colors";
import { useGetDataQuery } from "@/api/firebaseApi";
import Loader from "@/components/Loader";
import ValueContainer from "@/components/ValueContainer";
import { DataType } from "@/types/DataType";
import moment from "moment";
import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import {
  sendPushNotification,
  usePushNotifications,
} from "@/components/usePushNotifications";

interface AggregatedData {
  labels: string[];
  temperatures: number[];
  humidities: number[];
  carbondioxides: number[];
}

interface AggregatedDataByWeek {
  labels: string[];
  temperatures: number[];
  humidities: number[];
  carbondioxides: number[];
}

const processDataForChartByWeek = (
  data: DataType[]
): Record<string, AggregatedData> => {
  const groupedByWeekAndDay: Record<
    string,
    Record<
      string,
      { temps: number[]; humidities: number[]; carbondioxides: number[] }
    >
  > = {};

  data.forEach((item) => {
    const weekOfYear = moment.unix(item.ts).week(); // Week of the year
    const dayOfWeek = moment.unix(item.ts).format("dddd"); // 'Monday', 'Tuesday', etc.
    const key = `${weekOfYear}-${dayOfWeek}`;

    if (!groupedByWeekAndDay[weekOfYear]) {
      groupedByWeekAndDay[weekOfYear] = {};
    }
    if (!groupedByWeekAndDay[weekOfYear][dayOfWeek]) {
      groupedByWeekAndDay[weekOfYear][dayOfWeek] = {
        temps: [],
        humidities: [],
        carbondioxides: [],
      };
    }

    groupedByWeekAndDay[weekOfYear][dayOfWeek].temps.push(item.temp);
    groupedByWeekAndDay[weekOfYear][dayOfWeek].humidities.push(item.humidity);
    groupedByWeekAndDay[weekOfYear][dayOfWeek].carbondioxides.push(
      item.carbondioxide
    );
  });

  // Calculate averages and prepare data for each week separately
  const result: Record<string, AggregatedDataByWeek> = {};
  Object.keys(groupedByWeekAndDay).forEach((week) => {
    const daysData = groupedByWeekAndDay[week];
    const labels = Object.keys(daysData);
    const temperatures = labels.map(
      (day) =>
        daysData[day].temps.reduce((acc, curr) => acc + curr, 0) /
        daysData[day].temps.length
    );
    const humidities = labels.map(
      (day) =>
        daysData[day].humidities.reduce((acc, curr) => acc + curr, 0) /
        daysData[day].humidities.length
    );

    const carbondioxides = labels.map(
      (day) =>
        daysData[day].carbondioxides.reduce((acc, curr) => acc + curr, 0) /
        daysData[day].carbondioxides.length
    );

    result[week] = { labels, temperatures, humidities, carbondioxides };
  });

  return result;
};

const processDataForChart = (data: DataType[]): AggregatedData => {
  // Get today's date in "YYYY-MM-DD" format
  const today = moment().format("YYYY-MM-DD");

  // Filter data to include only today's entries
  const todaysData = data.filter(
    (item) => moment.unix(item.ts).format("YYYY-MM-DD") === today
  );

  // Prepare to group data by today's date (even though it's only one day, this keeps your structure consistent)
  const groupedByDay: Record<
    string,
    { temps: number[]; humidities: number[]; carbondioxides: number[] }
  > = {};

  // Grouping data
  todaysData.forEach((item) => {
    if (!groupedByDay[today]) {
      groupedByDay[today] = {
        temps: [],
        humidities: [],
        carbondioxides: [],
      };
    }
    groupedByDay[today].temps.push(item.temp);
    groupedByDay[today].humidities.push(item.humidity);
    groupedByDay[today].carbondioxides.push(item.carbondioxide);
  });

  // Calculate averages for today
  const labels = Object.keys(groupedByDay); // This will typically be just today's date
  const temperatures = labels.map((day) => {
    const temps = groupedByDay[day].temps;
    return temps.reduce((acc, curr) => acc + curr, 0) / temps.length;
  });

  const humidities = labels.map((day) => {
    const hums = groupedByDay[day].humidities;
    return hums.reduce((acc, curr) => acc + curr, 0) / hums.length;
  });

  const carbondioxides = labels.map((day) => {
    const co2s = groupedByDay[day].carbondioxides;
    return co2s.reduce((acc, curr) => acc + curr, 0) / co2s.length;
  });

  // console.log(labels, temperatures, humidities, carbondioxides);

  // Map values to keep decimal precision
  return {
    labels,
    temperatures: temperatures.map((t) => parseFloat(t.toFixed(2))),
    humidities: humidities.map((h) => parseFloat(h.toFixed(2))),
    carbondioxides: carbondioxides.map((c) => parseFloat(c.toFixed(2))),
  };
};

let html;
let rows;

// Main screens
export default function TabOneScreen() {
  const { data, isLoading } = useGetDataQuery(undefined, {
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  });

  const { data: notificationData } = useGetDataQuery(undefined, {
    pollingInterval: 18000000,
    skipPollingIfUnfocused: true,
  });

  const [isWeekly, setIsWeekly] = useState(true);

  const toggleSwitch = () => setIsWeekly((previousState) => !previousState);

  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    async function prepare() {
      if (notificationData) {
        const dataArray: DataType[] = Object.values(notificationData);

        const latestValue = dataArray.pop();

        if (latestValue && expoPushToken) {
          if (latestValue?.temp > 15) {
            await sendPushNotification(expoPushToken, "Temperature");
          } else if (latestValue?.carbondioxide > 600) {
            await sendPushNotification(expoPushToken, "Carbondioxide");
          } else if (latestValue?.humidity > 70) {
            await sendPushNotification(expoPushToken, "Humidity");
          }
        }
      }
    }

    prepare();
  }, [notificationData]);

  useEffect(() => {
    if (data) {
      const dataArray: DataType[] = Object.values(data);
      rows = dataArray
        .map(
          (item) => `
        <tr>
          <td>${moment.unix(item.ts).format("YYYY-MM-DD HH:mm")}</td>
          <td>${item.temp}</td>
          <td>${item.humidity}</td>
          <td>${item.carbondioxide}</td>
        </tr>
      `
        )
        .join("");
    }
    html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    </style>
  </head>
  <body style="text-align: center;">
    <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Carbon Dioxide (ppm)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
    </table>
  </body>
</html>
`;
  }, [data]);

  let lastedData;
  let filteredData: DataType[] = [];

  if (data) {
    const dataArray: DataType[] = Object.values(data);
    filteredData = dataArray.filter(
      (item) =>
        !(
          (item.humidity === 998 && item.carbondioxide === 5000)
          // &&
          // item.temp === 998
        )
    );

    const sortedArray = filteredData.sort((a, b) => a.ts - b.ts);
    lastedData = sortedArray[filteredData.length - 1];
  }

  const weekNumber = moment.unix(Date.now() / 1000).week();

  const processData = (values: DataType[], isWeekly: Boolean) => {
    if (isWeekly) {
      const overAllData = processDataForChartByWeek(values);
      // console.log("weekNumber", weekNumber, overAllData[20]);
      return overAllData[weekNumber] === undefined
        ? { carbondioxides: [], humidities: [], labels: [], temperatures: [] }
        : overAllData[weekNumber];
    }
    return processDataForChart(values);
  };

  const chartData = processData(filteredData, isWeekly);
  // console.log("chartData", chartData);

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
      <Text style={styles.heading}>Last logged values</Text>
      <View style={styles.overAllChart}>
        <ValueContainer
          title="Temperature"
          value={Number(lastedData?.temp)}
          symbol="°C"
        />
        <ValueContainer
          title="Humidity"
          value={Number(lastedData?.humidity)}
          symbol="%"
        />
        <ValueContainer
          title="Carbondioxide"
          value={Number(lastedData?.carbondioxide)}
          symbol="Ppm"
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>{isWeekly ? "Weekly" : "Daily"}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#f4f3f4" }}
          thumbColor={isWeekly ? "#87A922" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isWeekly}
        />
      </View>

      {chartData.temperatures.length !== 0 ? (
        <View>
          <Text>Temperature Chart</Text>
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.temperatures,
                },
              ],
            }}
            width={width * 0.95} // from react-native
            height={height * 0.25}
            yAxisSuffix="°C"
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

          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.humidities,
                },
              ],
            }}
            width={width * 0.95} // from react-native
            height={height * 0.25}
            yAxisSuffix="%"
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

          <Text>Carbondioxide Chart</Text>
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.carbondioxides,
                },
              ],
            }}
            width={width * 0.95} // from react-native
            height={height * 0.25}
            yAxisSuffix="ppm"
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
        </View>
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.text}>
            {!isWeekly ? "No Data Logged Today" : "No Data Logged this Week"}
          </Text>
          <Text style={styles.text}>
            {!isWeekly
              ? "Please check your sensors or switch to weekly data"
              : "Please check your sensors"}
          </Text>
        </View>
      )}

      <View style={styles.btnContainer}>
        <Link href="/report" asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>Generate Report</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: tenth,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  overAllChart: {
    marginVertical: tenth,
  },
  btnContainer: {
    width: "80%",
  },
  switchContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: tenth,
    gap: tenth,
  },
  emptyView: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.4,
  },
  text: {
    fontSize: 16,
    color: themeColor,
    lineHeight: 24,
  },
  btn: {
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
  btnText: { fontSize: 18, fontWeight: "700", color: Colors.light.background },
});
