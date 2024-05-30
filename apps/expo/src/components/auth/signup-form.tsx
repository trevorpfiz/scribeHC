import * as React from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { SignUp, SignUpSchema } from "@hh/validators";

import { OTPVerification } from "~/components/auth/otp-verification";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Loader2 } from "~/lib/icons/loader-2";
import { cn } from "~/lib/utils";

const SignUpForm = () => {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const form = useForm<SignUp>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send the email for verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setEmail(data.email);
      setPendingVerification(true);
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    router.push("/toggle");
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text>Sign Up</Text>

      {!pendingVerification && (
        <View className="flex-1 px-6">
          <FormProvider {...form}>
            <View className="flex flex-col gap-4">
              <Controller
                control={form.control}
                name="email"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <Label
                      className={cn(error && "text-destructive", "pb-2.5")}
                      nativeID="emailLabel"
                    >
                      Email address
                    </Label>
                    <Input
                      placeholder="Email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      accessibilityLabel="Email address"
                      accessibilityLabelledBy="emailLabel"
                      autoCapitalize="none"
                    />
                    {error && (
                      <Animated.Text
                        entering={FadeInDown}
                        exiting={FadeOutUp.duration(275)}
                        className="px-0.5 py-2 text-sm text-destructive"
                        role="alert"
                      >
                        {error.message}
                      </Animated.Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <Label
                      className={cn(error && "text-destructive", "pb-2.5")}
                      nativeID="passwordLabel"
                    >
                      Password
                    </Label>
                    <Input
                      placeholder="Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      accessibilityLabel="Password"
                      accessibilityLabelledBy="passwordLabel"
                      secureTextEntry
                      autoCapitalize="none"
                    />
                    {error && (
                      <Animated.Text
                        entering={FadeInDown}
                        exiting={FadeOutUp.duration(275)}
                        className="px-0.5 py-2 text-sm text-destructive"
                        role="alert"
                      >
                        {error.message}
                      </Animated.Text>
                    )}
                  </View>
                )}
              />
            </View>
          </FormProvider>
          <View className="px-12 pb-4">
            <Button onPress={form.handleSubmit(onSubmit)}>
              {isLoading ? (
                <View className="flex-row items-center justify-center gap-3">
                  <Loader2
                    size={24}
                    color="white"
                    strokeWidth={3}
                    className="animate-spin"
                  />
                  <Text className="text-xl font-medium text-primary-foreground">
                    Submitting...
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-medium text-primary-foreground">
                  Submit
                </Text>
              )}
            </Button>
          </View>
        </View>
      )}

      {pendingVerification && (
        <OTPVerification email={email} onSuccess={handleVerificationSuccess} />
      )}
    </View>
  );
};

export { SignUpForm };
