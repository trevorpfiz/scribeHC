import type { SharedValue } from "react-native-reanimated";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
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

const WaveformAnimation: React.FC<{ metering: SharedValue<number> }> = ({
  metering,
}) => {
  const ballSize = 40;
  const initialOffset = 0;
  const finalOffsets = [-90, -30, 30, 90]; // 4 balls 60px apart

  // Shared value for the horizontal offset
  const offset = useSharedValue(initialOffset);

  useEffect(() => {
    offset.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 600 }),
    );
  }, [offset]);

  // Shared values for ball heights based on volume
  const ballHeights = finalOffsets.map((_, index) => {
    const min = 40;
    const max = index === 0 || index === finalOffsets.length - 1 ? 150 : 300;
    const delay = index * 30; // Adjusted delay to smaller increments

    return useDerivedValue(() => {
      const targetHeight = interpolate(metering.value, [-50, 0], [min, max]);

      return withDelay(
        delay,
        withClamp({ min, max }, withSpring(targetHeight)),
      );
    });
  });

  // Styles for each ball
  const ballStyles = finalOffsets.map((finalOffset, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offset.value * finalOffset }],
        backgroundColor: "black",
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
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    position: "absolute",
    borderRadius: 9999,
  },
});

export default WaveformAnimation;
