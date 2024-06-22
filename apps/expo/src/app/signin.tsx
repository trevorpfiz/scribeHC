import { useState } from "react";
import { Keyboard, ScrollView, TouchableWithoutFeedback } from "react-native";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn } from "@clerk/clerk-expo";

import type { SignInFormProps } from "~/components/auth/signin-form";
import { SignInForm } from "~/components/auth/signin-form";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SignInFormProps["onSubmit"] = async (data) => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

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
            <SignInForm onSubmit={onSubmit} isLoading={isLoading} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </AvoidSoftInputView>
    </SafeAreaView>
  );
}
