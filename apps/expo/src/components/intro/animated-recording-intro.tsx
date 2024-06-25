// AnimatedIntro.js
import { memo, useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import colors from "tailwindcss/colors";

import { useAnimationStore } from "~/stores/animationStore";
import FanOutBallsAnimation from "./fanning";

const content = [
  {
    title: "Let's create.",
    bg: colors.lime[100],
    fontColor: colors.pink[500],
  },
  {
    title: "Let's brainstorm.",
    bg: colors.stone[900],
    fontColor: colors.sky[200],
  },
  {
    title: "Let's discover.",
    bg: colors.orange[500],
    fontColor: colors.blue[700],
  },
  {
    title: "Let's go.",
    bg: colors.teal[700],
    fontColor: colors.yellow[400],
  },
  {
    title: "ChatGPT.",
    bg: colors.green[800],
    fontColor: colors.pink[500],
  },
];

const AnimatedIntro = () => {
  const isFanningOut = useAnimationStore((state) => state.isFanningOut);
  const setFanningOut = useAnimationStore((state) => state.setFanningOut);
  const setBallColor = useAnimationStore((state) => state.setBallColor);

  const { width } = useWindowDimensions();
  const ballWidth = 40;
  const half = width / 2 - ballWidth / 2;

  const currentX = useSharedValue(half);
  const currentIndex = useSharedValue(0);
  const isAtStart = useSharedValue(true);
  const labelWidth = useSharedValue(0);
  const canGoToNext = useSharedValue(false);

  const newColorIndex = useDerivedValue(() => {
    if (!isAtStart.value) {
      return (currentIndex.value + 1) % content.length;
    }
    return currentIndex.value;
  }, [currentIndex]);

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        currentX.value,
        [half, half + labelWidth.value / 2],
        [
          content[newColorIndex.value].fontColor,
          content[currentIndex.value].fontColor,
        ],
        "RGB",
      ),
      transform: [
        {
          translateX: interpolate(
            currentX.value,
            [half, half + labelWidth.value / 2],
            [half + 4, half - labelWidth.value / 2],
          ),
        },
      ],
    };
  }, [currentIndex, currentX]);

  const ballStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        currentX.value,
        [half, half + labelWidth.value / 2],
        [
          content[newColorIndex.value].fontColor,
          content[currentIndex.value].fontColor,
        ],
        "RGB",
      ),
      transform: [{ translateX: currentX.value }],
    };
  });

  const mask = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        currentX.value,
        [half, half + labelWidth.value / 2],
        [content[newColorIndex.value].bg, content[currentIndex.value].bg],
        "RGB",
      ),
      transform: [{ translateX: currentX.value }],
      width: width / 1.5,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    }),
    [currentIndex, currentX, labelWidth],
  );

  const style1 = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      currentX.value,
      [half, half + labelWidth.value / 2],
      [content[newColorIndex.value].bg, content[currentIndex.value].bg],
      "RGB",
    ),
    opacity: interpolate(1, [1, 0], [1, 0, 0, 0, 0, 0, 0]),
    transform: [
      {
        translateX: interpolate(
          1,
          [1, 0],
          [0, -width * 2, -width, -width, -width, -width, -width],
        ),
      },
    ],
  }));

  const text = useDerivedValue(() => {
    const index = currentIndex.value;
    return content[index].title;
  }, [currentIndex]);

  useAnimatedReaction(
    () => labelWidth.value,
    (newWidth) => {
      currentX.value = withDelay(
        800,
        withTiming(
          half + newWidth / 2,
          {
            duration: 800,
          },
          (finished) => {
            if (finished) {
              canGoToNext.value = true;
              isAtStart.value = false;
            }
          },
        ),
      );
    },
    [labelWidth, currentX, half],
  );

  useAnimatedReaction(
    () => canGoToNext.value,
    (next) => {
      if (next) {
        canGoToNext.value = false;
        currentX.value = withDelay(
          1000,
          withTiming(
            half,
            {
              duration: 800,
            },
            (finished) => {
              if (finished) {
                currentIndex.value = (currentIndex.value + 1) % content.length;
                isAtStart.value = true;
                runOnJS(setBallColor)(content[currentIndex.value].fontColor); // Set the ball color
                runOnJS(setFanningOut)(true); // Trigger fan out animation
              }
            },
          ),
        );
      }
    },
    [currentX, labelWidth],
  );

  const handleFanOutComplete = () => {
    setFanningOut(false);
    canGoToNext.value = true; // Continue the cycle
  };

  return (
    <Animated.View style={[styles.wrapper, style1]}>
      <Animated.View style={[styles.content]}>
        {isFanningOut ? (
          <FanOutBallsAnimation onFanOutComplete={handleFanOutComplete} />
        ) : (
          <>
            <Animated.View style={[styles.ball, ballStyle]} />
            <Animated.View style={[styles.mask, mask]} />
            <ReText
              onLayout={(e) => {
                labelWidth.value = e.nativeEvent.layout.width + 4;
              }}
              style={[styles.title, textStyle]}
              text={text}
            />
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 292,
  },
  mask: {
    zIndex: 1,
    position: "absolute",
    left: "0%",
    height: 44,
  },
  ball: {
    width: 40,
    height: 40,
    backgroundColor: colors.black,
    borderRadius: 9999,
    zIndex: 10,
    position: "absolute",
    left: "0%",
  },
  titleText: {
    flexDirection: "row",
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    left: "0%",
    position: "absolute",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
});

export default memo(AnimatedIntro);
