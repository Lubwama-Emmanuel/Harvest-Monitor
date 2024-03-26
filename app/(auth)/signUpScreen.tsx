import { Image, Pressable, StyleSheet, TextInput } from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { View, Text, ScrollView } from "@/components/Themed";
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
import { SignUp, addUser } from "@/utils/Authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/AuthSlice";
import { UserType } from "@/types/UserType";
import { showNotification } from "@/redux/slices/NotificationSlice";
import Loader from "@/components/Loader";

export default function SignUpScreen() {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const nameInputRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const dispatch = useDispatch();

  const handleLogIn = () => {
    router.replace("/login");
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
  const handleNameBlur = () => {
    if (name.length < 2) {
      setNameError("Please enter valid names");
    } else {
      setNameError("");
    }
  };

  const handleConfirmPasswordChange = (password: string) => {
    setConfirmPassword("");
    setConfirmPassword(password);
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword.length < 8 || password !== confirmPassword) {
      setConfirmPasswordError("Both passwords must be the same");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handlePasswordBlur = () => {
    if (password.length < 8) {
      setPasswordError("Password should be more than 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleNameChange = (name: string) => {
    setNameError("");
    setName(name);
  };

  async function handleSignUp() {
    console.log("clicked");
    setIsLoading(true);

    try {
      const res = await SignUp(email, password);
      const token = await res?.user.getIdToken();
      const userId = res.user.uid;

      const userDetails: UserType = {
        userId,
        name,
        email,
      };

      if (token != null) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(userDetails));
        await addUser(userId, name, email);
        dispatch(setUser(userDetails));
      }

      setIsLoading(false);
      dispatch(showNotification("You registered successfully!"));
      console.log(res?.user);
      router.replace("/(app)/");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        console.log(error.message);
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          dispatch(showNotification("Email already in use!"));
          router.replace("/login");
        }
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/signUp.png")}
          style={styles.image}
        />
      </View> */}
      <HeadingText>Sign Up</HeadingText>
      <View style={styles.innerContainer}>
        <Input
          label="Farm name"
          ref={nameInputRef}
          inputConfig={{
            placeholder: "Enter farm name here",
            value: name,
            onChangeText: handleNameChange,
            onBlur: handleNameBlur,
            returnKeyType: "next",
            onSubmitEditing: () => emailRef.current?.focus(),
          }}
          error={nameError}
        >
          <Ionicons name="person" color={"gray"} size={20} />
        </Input>
        <Input
          label="Email"
          ref={emailRef}
          inputConfig={{
            placeholder: "Enter email addresses here",
            value: email,
            onChangeText: handleEmailChange,
            onBlur: handleEmailBlur,
            returnKeyType: "next",
            onSubmitEditing: () => phoneRef.current?.focus(),
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
            onBlur: handlePasswordBlur,
            returnKeyType: "next",
            onSubmitEditing: () => confirmPasswordRef.current?.focus(),
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
        <Input
          label="Confirm password"
          ref={confirmPasswordRef}
          inputConfig={{
            placeholder: "Confirm password",
            textContentType: "newPassword",
            secureTextEntry: !showConfirmPassword,
            value: confirmPassword,
            onChangeText: handleConfirmPasswordChange,
            onBlur: handleConfirmPasswordBlur,
            returnKeyType: "done",
          }}
          error={confirmPasswordError}
        >
          {showConfirmPassword ? (
            <Pressable
              onPress={() => {
                setShowConfirmPassword((value) => !value);
              }}
            >
              <Feather name="eye" size={20} color={"gray"} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowConfirmPassword((value) => !value);
              }}
            >
              <Feather name="eye-off" size={20} color={"gray"} />
            </Pressable>
          )}
        </Input>
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
          onPressFunction={handleSignUp}
        >
          Sign up
        </ButtonPrimary>
      </View>
      <View style={styles.logIn}>
        <HeadingMedium>Already have an account ?</HeadingMedium>
        <PressableText onPressFunction={handleLogIn}> Log in.</PressableText>
      </View>
      {isLoading && <Loader message="Signing you up" />}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: height * 0.05,
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
    resizeMode: "cover",
  },
  logIn: {
    flexDirection: "row",
    marginVertical: tenth,
  },
});
