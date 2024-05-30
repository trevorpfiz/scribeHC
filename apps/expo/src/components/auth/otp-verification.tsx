import type { RefObject } from "react";
import type { TextInput } from "react-native";
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";

import { OTPInput } from "~/components/auth/otp-input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Loader2 } from "~/lib/icons/loader-2";

export const OTPVerification = (props: { onSuccess: () => void }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [codes, setCodes] = useState<string[]>(Array(6).fill(""));
  const refs: RefObject<TextInput>[] = useRef(
    Array.from({ length: 6 }, () => React.createRef<TextInput>()),
  ).current;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[] | undefined>();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  const onChangeCode = (text: string, index: number) => {
    setErrorMessages(undefined);
    const newCodes = [...codes];
    if (text.length > 1) {
      const splitCodes = text.split("");
      splitCodes.forEach((code, i) => {
        if (i < 6) {
          newCodes[i] = code;
        }
      });
      refs[5].current?.focus();
    } else {
      newCodes[index] = text;
      if (text !== "" && index < 5) {
        refs[index + 1].current?.focus();
      }
    }
    setCodes(newCodes);
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("verifying", codes.join(""));
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: codes.join(""),
      });
      console.log("verified");
      await setActive({ session: completeSignUp.createdSessionId });
      console.log("active");

      // handle verification success
      props.onSuccess();
    } catch (err: unknown) {
      setErrorMessages(err.errors?.[0]?.message || "Verification failed");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TouchableWithoutFeedback>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="mb-4 text-2xl font-bold">Security code sent!</Text>
          <Text className="mb-4 text-center">
            To continue, please enter the 6 digit verification code sent to the
            provided email.
          </Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text className="mb-6 underline">
              Didn't receive the code? Resend
            </Text>
          </TouchableOpacity>
          <OTPInput
            codes={codes}
            errorMessages={errorMessages}
            onChangeCode={onChangeCode}
            refs={refs}
          />
          {errorMessages && (
            <Text className="mt-2 text-sm text-destructive">
              {errorMessages}
            </Text>
          )}
          <Button onPress={onPressVerify} className="mt-6" disabled={isLoading}>
            {isLoading ? (
              <View className="flex-row items-center justify-center gap-3">
                <Loader2
                  size={24}
                  color="black"
                  strokeWidth={3}
                  className="animate-spin"
                />
                <Text className="text-xl font-medium">Verifying...</Text>
              </View>
            ) : (
              <Text className="text-xl font-medium">Continue</Text>
            )}
          </Button>
          <Text className="mt-6 text-center">
            By continuing, you agree to scribeHH's{" "}
            <Text className="underline">Terms of Service</Text> and{" "}
            <Text className="underline">Privacy Policy</Text>, and to receive
            periodic emails with updates.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
