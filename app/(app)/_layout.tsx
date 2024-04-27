import { Redirect, Stack } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Pressable, StyleSheet } from "react-native";
import Colors, { themeColor } from "@/constants/Colors";
import { height } from "@/constants/Dimension";
import { Entypo } from "@expo/vector-icons";
import { LogOut } from "@/utils/Authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearUser } from "@/redux/slices/AuthSlice";
import { showNotification } from "@/redux/slices/NotificationSlice";

export default function AppLayout() {
  const { isLoggedIn } = useSelector(
    (state: RootState) => state.persistedReducer.auth
  );
  const dispatch = useDispatch();

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }

  async function handleLogOut() {
    try {
      await LogOut();
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userDetails");
      dispatch(clearUser());
      dispatch(showNotification("Logged out successfully"));
    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Dashboard",
          headerRight: () => (
            <Pressable onPress={handleLogOut}>
              <Entypo name="log-out" size={24} color={themeColor} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="report"
        options={{
          presentation: "modal",
          headerTitle: "Generate Report",
        }}
      />
    </Stack>
  );
}
