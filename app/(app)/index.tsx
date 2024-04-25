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
import { DataType } from "@/types/DataType";
import moment from "moment";

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
  const groupedByDay: Record<
    string,
    { temps: number[]; humidities: number[]; carbondioxides: number[] }
  > = {};

  // Grouping data
  data.forEach((item) => {
    const dayOfWeek = moment.unix(item.ts).format("ddd");
    if (!groupedByDay[dayOfWeek]) {
      groupedByDay[dayOfWeek] = {
        temps: [],
        humidities: [],
        carbondioxides: [],
      };
    }
    groupedByDay[dayOfWeek].temps.push(item.temp);
    groupedByDay[dayOfWeek].humidities.push(item.humidity);
    groupedByDay[dayOfWeek].carbondioxides.push(item.carbondioxide);
  });

  // Calculating avg temp, hum, meth
  const labels = Object.keys(groupedByDay);
  const temparatures = labels.map((day) => {
    const temps = groupedByDay[day].temps;
    return temps.reduce((acc, curr) => acc + curr, 0) / temps.length;
  });

  const humidities = labels.map((day) => {
    const humidities = groupedByDay[day].humidities;
    return humidities.reduce((acc, curr) => acc + curr, 0) / humidities.length;
  });

  const carbondioxides = labels.map((day) => {
    const carbondioxides = groupedByDay[day].carbondioxides;
    return (
      carbondioxides.reduce((acc, curr) => acc + curr, 0) /
      carbondioxides.length
    );
  });

  return {
    labels,
    temperatures: temparatures.map((t) => parseFloat(t.toFixed(2))),
    humidities: humidities.map((h) => parseFloat(h.toFixed(2))),
    carbondioxides: carbondioxides.map((m) => parseFloat(m.toFixed(2))),
  };
};

// Main screens
export default function TabOneScreen() {
  const { data, isLoading } = useGetDataQuery(undefined, {
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  });

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

  const processedData = processDataForChartByWeek(filteredData);
  const weekData = processedData[weekNumber];

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

      <Text>Temperature Chart</Text>
      <LineChart
        data={{
          labels: weekData.labels,
          datasets: [
            {
              data: weekData.temperatures,
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
          labels: weekData.labels,
          datasets: [
            {
              data: weekData.humidities,
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

      <Text>Carbondioxide Chart</Text>
      <LineChart
        data={{
          labels: weekData.labels,
          datasets: [
            {
              data: weekData.carbondioxides,
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
