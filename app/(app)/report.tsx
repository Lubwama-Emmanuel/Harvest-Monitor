import { Text, View } from "@/components/Themed";
import ButtonPrimary from "@/components/ButtonPrimary";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

import { StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useGetDataQuery } from "@/api/firebaseApi";
import { DataType } from "@/types/DataType";
import moment from "moment";
import { tenth } from "@/constants/Measurements";

function createHTMLString(dataArray: DataType[]) {
  const rows = dataArray
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

  return `
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
}

export default function Report() {
  const { data, isLoading } = useGetDataQuery(undefined, {
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  });

  const [isError, setIsError] = useState(false);

  const filterDataForToday = (data: DataType[]) => {
    const today = moment().startOf("day").unix();
    return data.filter((item) => moment.unix(item.ts).isSame(moment(), "day"));
  };

  const filterDataForCurrentWeek = (data: DataType[]) => {
    const startOfWeek = moment().startOf("week").unix();
    const endOfWeek = moment().endOf("week").unix();
    return data.filter(
      (item) =>
        moment.unix(item.ts).unix() >= startOfWeek &&
        moment.unix(item.ts).unix() <= endOfWeek
    );
  };

  const generateReport = async (data: DataType[]) => {
    const html = createHTMLString(data);
    const file = await Print.printToFileAsync({ html, base64: false });
    await shareAsync(file.uri);
  };

  const handleGenerateDailyReport = () => {
    const dailyData = filterDataForToday(Object.values(data));
    console.log(dailyData);
    if (dailyData.length === 0) {
      setIsError(true);
      return;
    }
    generateReport(dailyData);
  };

  const handleGenerateWeeklyReport = () => {
    const weeklyData = filterDataForCurrentWeek(Object.values(data));
    if (isError) {
      setIsError(false);
    }
    generateReport(weeklyData);
  };

  return (
    <View style={styles.container}>
      {isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>No Data logged Today</Text>
          <Text style={styles.error}>
            Please check your sensors and try again
          </Text>
        </View>
      )}
      <View style={styles.btn}>
        <ButtonPrimary onPressFunction={handleGenerateWeeklyReport}>
          Weekly Report
        </ButtonPrimary>
      </View>
      <View style={styles.btn}>
        <ButtonPrimary onPressFunction={handleGenerateDailyReport}>
          Daily Report
        </ButtonPrimary>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    width: "80%",
  },
  errorContainer: {
    alignItems: "center",
    marginVertical: tenth,
  },
  error: {
    fontSize: 14,
    color: "red",
  },
});
