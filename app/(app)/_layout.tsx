import { Redirect, Stack } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

export default function AppLayout() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  console.log(isLoggedIn);

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "Dashboard",
          headerRight: () => {
            return <Entypo name="log-out" size={24} color="black" />;
          },
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
