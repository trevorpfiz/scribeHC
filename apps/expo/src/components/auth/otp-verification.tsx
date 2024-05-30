import type { RefObject } from "react";
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";

import { OTPInput } from "~/components/auth/otp-input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "~/lib/icons/loader-2";

export const OTPVerification = (props: { onSuccess: () => void }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [codes, setCodes] = useState<string[]>(Array(6).fill(""));
  const refs: RefObject<TextInput>[] = Array.from({ length: 6 }, () =>
    useRef<TextInput>(null),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[] | undefined>();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  const onChangeCode = (text: string, index: number) => {
    if (text.length > 1) {
      setErrorMessages(undefined);
      const newCodes = text.split("");
      setCodes(newCodes);
      refs[5]!.current?.focus();
      return;
    }
    setErrorMessages(undefined);
    const newCodes = [...codes];
    newCodes[index] = text;
    setCodes(newCodes);
    if (text !== "" && index < 5) {
      refs[index + 1]!.current?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err: any) {
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
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Security code sent!</Text>
          <Text style={styles.description}>
            To continue, please enter the 6 digit verification code sent to the
            provided email.
          </Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendLink}>
              Didn't receive the code? Resend
            </Text>
          </TouchableOpacity>
          <OTPInput
            codes={codes}
            errorMessages={errorMessages}
            onChangeCode={onChangeCode}
            refs={refs}
          />
          <Button onPress={onPressVerify} style={styles.button}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Loader2
                  size={24}
                  color="black"
                  strokeWidth={3}
                  className="animate-spin"
                />
                <Text style={styles.loadingText}>Verifying...</Text>
              </View>
            ) : (
              <Text className="text-xl font-medium text-primary-foreground">
                Continue
              </Text>
            )}
          </Button>
          <Text style={styles.footerText}>
            By continuing, you agree to Unkey's{" "}
            <Text style={styles.link}>Terms of Service</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>, and to receive
            periodic emails with updates.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  description: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  resendLink: {
    color: "#fff",
    textDecorationLine: "underline",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "black",
    marginLeft: 8,
  },
  footerText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 24,
  },
  link: {
    textDecorationLine: "underline",
  },
});
