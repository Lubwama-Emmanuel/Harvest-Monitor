import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import colors from "@/constants/Colors";
import { tenth } from "@/constants/Measurements";
import { forwardRef, useRef, type ReactNode, useImperativeHandle } from "react";
import size from "@/constants/Fonts";
import { Text, View, useThemeColor } from "./Themed";
import Colors, { themeColor } from "@/constants/Colors";

interface InputProps {
  label: string;
  children: ReactNode;
  inputConfig: TextInputProps;
  error?: string;
}

// eslint-disable-next-line react/display-name
const Input = forwardRef(
  ({ label, children, inputConfig, error }: InputProps, ref) => {
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    return (
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputLabel}>{label}</Text>
        <View style={[styles.innerContainer]}>
          <TextInput
            ref={inputRef}
            autoCapitalize="none"
            {...inputConfig}
            style={styles.textInput}
          />
          <View>{children}</View>
        </View>
        {error != null && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  textInputContainer: {
    width: "100%",
    // marginBottom: tenth,
  },
  textInputLabel: {
    fontSize: size.p2,
    marginBottom: tenth * 0.5,
  },
  innerContainer: {
    borderWidth: 1,
    paddingRight: tenth,
    borderRadius: 8,
    borderColor: themeColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    fontSize: 16,
    paddingHorizontal: tenth * 1.6,
    paddingVertical: tenth,
    width: "90%",
    borderRadius: 8,
  },
  error: {
    color: "red",
    fontSize: tenth * 1.3,
    opacity: 0.7,
  },
});

export default Input;
