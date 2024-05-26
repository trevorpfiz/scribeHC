import React from "react";
import { View } from "react-native";

import AnimatedIntro from "~/components/intro/animated-intro";
import LoginBottomSheet from "~/components/login-bottom-sheet";

export default function IndexScreen() {
  return (
    <View className="flex-1">
      <AnimatedIntro />
      <LoginBottomSheet />
    </View>
  );
}
