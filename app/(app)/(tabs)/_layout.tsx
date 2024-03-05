import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack, Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Dashboard",
        }}
      />
    </Stack>
  );
}
