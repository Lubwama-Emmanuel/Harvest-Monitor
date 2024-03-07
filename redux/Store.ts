import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setUser } from "./slices/AuthSlice";
import noticationReducer from "./slices/NotificationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: noticationReducer,
  },
});

const loadAuthState = async () => {
  try {
    const savedToken = await AsyncStorage.getItem("token");

    await AsyncStorage.removeItem("token");

    if (savedToken !== null) {
      store.dispatch(setUser());
    }
  } catch (error) {}
};

void loadAuthState();

export type RootState = ReturnType<typeof store.getState>;
