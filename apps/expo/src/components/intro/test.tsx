import React, { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withClamp,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import colors from "tailwindcss/colors";

const BarsRecordingAnimation = () => {
  const numberOfBars = 4;
  const barWidth = 20;
  const barSpacing = 10;

  // Shared value for volume
  const INITIAL_VOLUME = 50;
  const volume = useSharedValue(INITIAL_VOLUME);

  // Function to update the volume randomly
  useEffect(() => {
    const interval = setInterval(() => {
      volume.value = Math.random() * 100;
    }, 150);
    return () => clearInterval(interval);
  }, [volume]);

  // Shared values for bar heights based on volume
  const barHeights = Array(numberOfBars)
    .fill(0)
    .map((_, index) => {
      const min = 40;
      const max = index === 0 || index === numberOfBars - 1 ? 150 : 300;
      const delay = index * 30; // Adjusted delay to smaller increments

      return useDerivedValue(() => {
        const targetHeight = min + volume.value * ((max - min) / 100);
        return withDelay(
          delay,
          withClamp({ min, max }, withSpring(targetHeight)),
        );
      });
    });

  // Styles for each bar
  const barStyles = barHeights.map((height, index) =>
    useAnimatedStyle(() => {
      return {
        height: height.value,
        borderRadius: 9999,
      };
    }),
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {barStyles.map((style, index) => (
          <Animated.View key={index} style={[styles.bar, style]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 150, // Adjust this as needed for your design
    marginTop: 300,
  },
  bar: {
    width: 40,
    height: 40,
    zIndex: 10,
    backgroundColor: colors.black,
    marginHorizontal: 10,
  },
});

export default memo(BarsRecordingAnimation);
