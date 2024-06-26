import type { DerivedValue, SharedValue } from "react-native-reanimated";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withClamp,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { INTRO_CONTENT } from "~/lib/constants";

const FanOutBallsAnimation: React.FC<{
  handleColorChange: () => void;
  onFanOutComplete: () => void;
  currentIndex: SharedValue<number>;
  newColorIndex: DerivedValue<number>;
}> = ({ handleColorChange, onFanOutComplete, currentIndex, newColorIndex }) => {
  const ballSize = 40;
  const initialOffset = 0;
  const finalOffsets = [-90, -30, 30, 90]; // 4 balls 60px apart

  const isFanningOut = useSharedValue(true);
  const isHeightChanging = useSharedValue(false);
  const volume = useSharedValue(0);

  // Shared value for the horizontal offset
  const offset = useSharedValue(initialOffset);

  // Function to toggle the offset between initial and final states
  useEffect(() => {
    if (isFanningOut.value) {
      offset.value = withSequence(
        withTiming(0, { duration: 800 }),
        withTiming(1, { duration: 1000 }),
        withTiming(1, { duration: 2000 }), // Adjust heights here
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      );
      setTimeout(() => {
        runOnUI(() => {
          isHeightChanging.value = true;
        })();
      }, 1800); // Start height change at the 2-second mark
      setTimeout(() => {
        runOnUI(() => {
          volume.value = 0;
          isHeightChanging.value = false;
        })();
        handleColorChange();
      }, 3800);
      setTimeout(() => {
        onFanOutComplete();
      }, 5800); // Total duration of the fan out and in sequence
    }
  }, [isFanningOut, offset, onFanOutComplete]);

  // Function to update the volume randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (isHeightChanging.value) {
        runOnUI(() => {
          volume.value = Math.random() * 100;
        })();
      }
    }, 150);
    return () => clearInterval(interval);
  }, [volume.value, isHeightChanging.value]);

  // Shared values for ball heights based on volume
  const ballHeights = finalOffsets.map((_, index) => {
    const min = 40;
    const max = 150;
    const delay = index * 30;

    return useDerivedValue(() => {
      const targetHeight = min + volume.value * ((max - min) / 100);

      return withDelay(
        delay,
        withClamp({ min, max }, withSpring(targetHeight)),
      );
    });
  });

  // Styles for each ball
  const ballStyles = finalOffsets.map((finalOffset, index) =>
    useAnimatedStyle(() => {
      const color = interpolateColor(
        offset.value,
        [0, 1],
        [
          INTRO_CONTENT[newColorIndex.value].fontColor,
          INTRO_CONTENT[currentIndex.value].fontColor,
        ],
        "RGB",
      );
      return {
        transform: [{ translateX: offset.value * finalOffset }],
        backgroundColor: color,
        height: ballHeights[index].value,
        width: ballSize,
        borderRadius: ballSize / 2,
      };
    }),
  );

  return (
    <View style={styles.container}>
      {ballStyles.map((style, index) => (
        <Animated.View key={index} style={[styles.ball, style]} />
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
    borderRadius: 9999,
  },
});

export default FanOutBallsAnimation;
