import React from "react";
import { View } from "react-native";

import AnimatedIntro from "~/components/intro/animated-intro";
import AnimatedRecordingIntro from "~/components/intro/animated-recording-intro";
import FanOutBallsAnimation from "~/components/intro/fanning";
import BarsRecordingAnimation from "~/components/intro/recording-animation";
import LoginBottomSheet from "~/components/login-bottom-sheet";

export default function IndexScreen() {
  return (
    <View className="flex-1">
      {/* <AnimatedIntro /> */}
      <AnimatedRecordingIntro />
      {/* <BarsRecordingAnimation /> */}
      {/* <FanOutBallsAnimation /> */}
      <LoginBottomSheet />
    </View>
  );
}
