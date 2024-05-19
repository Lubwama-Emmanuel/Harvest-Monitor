import { Image, Pressable, StyleSheet, TextInput } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { View } from "@/src/components/Themed";
import HeadingText from "@/src/components/HeadingText";
import Input from "@/src/components/Input";
import { useRef, useState } from "react";
import { validateEmail } from "@/src/Helpers/HelperFunctions";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import { height } from "@/src/constants/Dimension";
import HeadingMedium from "@/src/components/HeadingMedium";
import PressableText from "@/src/components/PressableText";
import { tenth } from "@/src/constants/Measurements";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUser } from "@/src/redux/slices/AuthSlice";
import Loader from "@/src/components/Loader";
import { LogIn, getUser } from "@/src/utils/Authentication";
import { showNotification } from "@/src/redux/slices/NotificationSlice";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch();

  const emailInputRef = useRef<TextInput>(null);

  const passwordRef = useRef<TextInput>(null);

  const handleSignUp = () => {
    router.replace("/signUpScreen");
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (email: string) => {
    setEmailError("");
    setEmail(email);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  async function handleLogIn() {
    setIsLoading(true);

    try {
      const res = await LogIn(email, password);
      const token = await res?.user.getIdToken();
      const userId = res.user.uid;

      if (token != null) {
        const user = await getUser(userId);

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userDetails", JSON.stringify(user));
        dispatch(setUser(user));
      }

      setIsLoading(false);
      dispatch(showNotification("You logged in successfully"));
      router.replace("/(app)/");
      // console.log(res?.user);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
          dispatch(showNotification("Incorrect email or password!"));
        } else if (
          error.message === "Firebase: Error (auth/network-request-failed)."
        ) {
          dispatch(showNotification("Please check your internet connection!"));
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/login.png")}
          style={styles.image}
        />
      </View>
      <HeadingText>Login</HeadingText>
      <View style={styles.innerContainer}>
        <Input
          ref={emailInputRef}
          label="Email"
          inputConfig={{
            placeholder: "Enter email addresses here",
            value: email,
            onChangeText: handleEmailChange,
            onBlur: handleEmailBlur,
            autoCapitalize: "none",
            returnKeyType: "next",
            onSubmitEditing: () => passwordRef.current?.focus(),
            blurOnSubmit: false,
          }}
          error=""
        >
          <Ionicons name="person" color={"gray"} size={20} />
        </Input>
        <Input
          label="Password"
          ref={passwordRef}
          inputConfig={{
            placeholder: "Enter password",
            textContentType: "newPassword",
            secureTextEntry: !showPassword,
            value: password,
            onChangeText: handlePasswordChange,
            returnKeyType: "done",
          }}
          error=""
        >
          {showPassword ? (
            <Pressable
              onPress={() => {
                setShowPassword((value) => !value);
              }}
            >
              <Feather name="eye" size={20} color={"gray"} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowPassword((value) => !value);
              }}
            >
              <Feather name="eye-off" size={20} color={"gray"} />
            </Pressable>
          )}
        </Input>
      </View>
      <View style={styles.forgotPassword}>
        <PressableText>Forgot password?</PressableText>
      </View>
      <View style={styles.innerContainer}>
        <ButtonPrimary
          disabled={
            !!(
              emailError.length > 0 ||
              email.length === 0 ||
              password.length === 0
            )
          }
          onPressFunction={handleLogIn}
        >
          Log in
        </ButtonPrimary>
      </View>
      <View style={styles.logIn}>
        <HeadingMedium>Don't have an account ?</HeadingMedium>
        <PressableText onPressFunction={handleSignUp}> Sign Up.</PressableText>
      </View>
      {isLoading && <Loader message="Logging you in" />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.1,
  },
  innerContainer: {
    width: "90%",
  },
  imageContainer: {
    height: height * 0.3,
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "center",
  },
  logIn: {
    flexDirection: "row",
    marginVertical: tenth,
  },
  forgotPassword: {
    width: "90%",
    alignItems: "flex-end",
    marginBottom: tenth,
  },
});
