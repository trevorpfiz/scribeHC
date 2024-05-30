import React from "react";
import { Keyboard, ScrollView, TouchableWithoutFeedback } from "react-native";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignInForm } from "~/components/auth/signin-form";

export default function SignInScreen() {
  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
      <AvoidSoftInputView style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ flex: 1 }}
        >
          <ScrollView
            bounces={false}
            contentInsetAdjustmentBehavior="always"
            overScrollMode="always"
            showsVerticalScrollIndicator={true}
            className="flex-1 bg-secondary px-4 py-8"
          >
            <SignInForm />
          </ScrollView>
        </TouchableWithoutFeedback>
      </AvoidSoftInputView>
    </SafeAreaView>
  );
}
