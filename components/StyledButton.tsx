import { Colors } from "@/constants";
import { ConcertOne_400Regular, useFonts } from "@expo-google-fonts/concert-one";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface StyledButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  variant?: "large" | "small";
}

const StyledButton: React.FC<StyledButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = "large",
}) => {
  const [fontsLoaded] = useFonts({
    ConcertOne_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={Colors.button.GO_TEXT} />
      </View>
    );
  }

  const buttonVariantStyle =
    variant === "small" ? styles.smallButton : styles.largeButton;
  const textVariantStyle =
    variant === "small" ? styles.smallButtonText : styles.largeButtonText;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <TouchableOpacity
        style={[styles.goButton, buttonVariantStyle, ...(Array.isArray(style) ? style : [style]).filter(Boolean)]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text
          style={[styles.goButtonText, textVariantStyle, textStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  goButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  largeButton: {
    paddingVertical: 8,
  },

  smallButton: {
    paddingVertical: 4,
  },

  goButtonText: {
    color: Colors.button.GO_TEXT,
    fontFamily: "ConcertOne_400Regular",
    includeFontPadding: false,
    textAlignVertical: "center",
    textShadowColor: "#1a1a1a",
    textShadowRadius: 0,
  },

  largeButtonText: {
    fontSize: 52,
    letterSpacing: 4,
    textShadowOffset: { width: -4, height: -4 },
  },

  smallButtonText: {
    fontSize: 28,
    letterSpacing: 2,
    textShadowOffset: { width: -2, height: -2 },
  },
});

export default StyledButton;
