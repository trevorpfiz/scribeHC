import type { DerivedValue, SharedValue } from "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
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

const WaveformIntroAnimation: React.FC<{
  handleColorChange: () => void;
  onFanOutComplete: () => void;
  currentIndex: SharedValue<number>;
  newColorIndex: DerivedValue<number>;
}> = ({ handleColorChange, onFanOutComplete, currentIndex, newColorIndex }) => {
  const ballSize = 40;
  const initialOffset = 0;
  const finalOffsets = [-90, -30, 30, 90]; // 4 balls 60px apart

  const offset = useSharedValue(initialOffset); // horizontal offset
  const isFanningOut = useSharedValue(true);
  const volume = useSharedValue(0);

  const [isGenerating, setIsGenerating] = useState(false);

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
        setIsGenerating(true);
      }, 1800); // Start height change at the 2-second mark
      setTimeout(() => {
        setIsGenerating(false);
        handleColorChange();
      }, 3800);
      setTimeout(() => {
        onFanOutComplete();
      }, 5800); // Total duration of the fan out and in sequence
    }
  }, [isFanningOut, offset, onFanOutComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGenerating) {
      interval = setInterval(() => {
        const randomNum = Math.random() * 100;
        volume.value = randomNum;
      }, 150);
    } else {
      volume.value = 0;
    }

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Shared values for ball heights based on volume
  const ballHeights = finalOffsets.map((_, index) => {
    const min = 40;
    const max = index === 0 || index === finalOffsets.length - 1 ? 150 : 300;
    const delay = index * 30;

    return useDerivedValue(() => {
      const targetHeight = interpolate(volume.value, [0, 100], [min, max]);
      // min + volume.value * ((max - min) / 100);

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
          INTRO_CONTENT[newColorIndex.value]!.fontColor,
          INTRO_CONTENT[currentIndex.value]!.fontColor,
        ],
        "RGB",
      );
      return {
        transform: [{ translateX: offset.value * finalOffset }],
        backgroundColor: color,
        height: ballHeights[index]!.value,
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
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    position: "absolute",
    borderRadius: 9999,
  },
});

export default WaveformIntroAnimation;
