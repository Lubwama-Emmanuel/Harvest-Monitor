import { Image, Pressable, StyleSheet, TextInput } from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { View, Text } from "@/components/Themed";
import HeadingText from "@/components/HeadingText";
import Input from "@/components/Input";
import { useRef, useState } from "react";
import { validateEmail } from "@/Helpers/HelperFunctions";
import ButtonPrimary from "@/components/ButtonPrimary";
import { height } from "@/constants/Dimension";
import HeadingMedium from "@/components/HeadingMedium";
import PressableText from "@/components/PressableText";
import { tenth } from "@/constants/Measurements";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/AuthSlice";
import Loader from "@/components/Loader";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const emailInputRef = useRef<TextInput>(null);

  const passwordRef = useRef<TextInput>(null);

  const handleSignUp = () => {
    router.replace("/signUp");
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
    setPasswordError("");
    setPassword(password);
  };

  async function handleLogin() {
    if (emailError.length > 0 || email.length === 0 || password.length === 0) {
      setEmailError("You can't leave this field empty!");
      setPasswordError("You can't leave this field empty!");
      return;
    }
    setIsLoading(true);
    try {
      await AsyncStorage.setItem("token", "hundf");
      dispatch(setUser());
      setIsLoading(false);
      router.replace("/(app)/(tabs)");
    } catch (error) {
      console.log("an error occured", error);
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
          error={emailError}
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
          error={passwordError}
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
          onPressFunction={handleLogin}
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
