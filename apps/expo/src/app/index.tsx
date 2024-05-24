import React from "react";
import { View } from "react-native";

import LoginBottomSheet from "~/components/login-bottom-sheet";
import AnimatedIntro from "~/components/ui/intro/animated-intro";

export default function Index() {
  return (
    <View className="flex-1">
      <AnimatedIntro />
      <LoginBottomSheet />
    </View>
  );
}
