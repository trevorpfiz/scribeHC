// FanOutBallsAnimation.tsx
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import colors from "tailwindcss/colors";

import { useAnimationStore } from "~/stores/animationStore";

const FanOutBallsAnimation: React.FC<{ onFanOutComplete: () => void }> = ({
  onFanOutComplete,
}) => {
  const ballSize = 40;
  const initialOffset = 0;
  const finalOffsets = [-90, -30, 30, 90]; // 4 balls 60px apart

  const isFanningOut = useAnimationStore((state) => state.isFanningOut);
  const setFanningOut = useAnimationStore((state) => state.setFanningOut);
  const ballColor = useAnimationStore((state) => state.ballColor);

  // Shared value for the horizontal offset
  const offset = useSharedValue(initialOffset);

  // Function to toggle the offset between initial and final states
  useEffect(() => {
    if (isFanningOut) {
      offset.value = withSequence(
        withTiming(0, { duration: 800 }),
        withTiming(1, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      );
      setTimeout(() => {
        onFanOutComplete();
      }, 3800); // Total duration of the fan out and in sequence
    }
  }, [isFanningOut, offset, onFanOutComplete]);

  // Styles for each ball
  const ballStyles = finalOffsets.map((finalOffset, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offset.value * finalOffset }],
        backgroundColor: ballColor,
      };
    }),
  );

  return (
    <View style={[styles.container, { height: ballSize }]}>
      {ballStyles.map((style, index) => (
        <Animated.View
          key={index}
          style={[styles.ball, style, { width: ballSize, height: ballSize }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    width: 200, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    position: "absolute",
    backgroundColor: colors.black,
    borderRadius: 9999,
  },
});

export default FanOutBallsAnimation;
