import { Redirect, Stack } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { LogOut } from "@/utils/Authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearUser } from "@/redux/slices/AuthSlice";
import { showNotification } from "@/redux/slices/NotificationSlice";
import { TouchableOpacity } from "react-native";

export default function AppLayout() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

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
          headerShown: true,
          headerTitle: "Dashboard",
          headerRight: () => {
            return (
              <TouchableOpacity onPress={handleLogOut}>
                <Entypo name="log-out" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      />
      {/* modal */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
