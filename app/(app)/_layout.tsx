import { Redirect, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { LogOut } from "@/utils/Authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearUser } from "@/redux/slices/AuthSlice";
import { showNotification } from "@/redux/slices/NotificationSlice";
import { StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View } from "@/components/Themed";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { themeColor } from "@/constants/Colors";
import { height } from "@/constants/Dimension";

// Custom Drawer Content Component
function CustomDrawerContent(props) {
  const dispatch = useDispatch();

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
    <View style={{ flex: 1, position: "relative" }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.container}>
          <Text style={styles.text}>Harvest Monitor</Text>
        </View>
        <DrawerItemList {...props} />
        <View style={styles.line} />
        <TouchableOpacity style={styles.logOutContainer} onPress={handleLogOut}>
          <Text style={styles.logOut}>Log out</Text>
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={themeColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
}

export default function AppLayout() {
  const { isLoggedIn } = useSelector(
    (state: RootState) => state.persistedReducer.auth
  );

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitle: "Dashboard",
            drawerLabel: () => {
              return <Text>Dashboard</Text>;
            },
          }}
        />
        <Drawer.Screen
          name="report"
          options={{
            headerShown: true,
            headerTitle: "Reports",
            drawerLabel: () => {
              return <Text>Reports</Text>;
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  text: {
    fontSize: 20,
    color: themeColor,
    fontWeight: "900",
  },
  logOut: {
    fontSize: 16,
    color: themeColor,
    fontWeight: "800",
    opacity: 0.7,
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor: themeColor,
    marginTop: height * 0.55,
  },
  logOutContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    marginLeft: 5,
  },
});
