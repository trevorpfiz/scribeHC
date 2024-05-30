import type { SubmitHandler } from "react-hook-form";
import React, { useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { SignIn } from "@hh/validators";
import { SignInSchema } from "@hh/validators";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Loader2 } from "~/lib/icons/loader-2";
import { cn } from "~/lib/utils";

const SignInForm = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignIn>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignIn> = async (data) => {
    if (!isLoaded) {
      return;
    }

    console.log(data);

    setIsLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(err);
    }

    router.push("/toggle");
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text>Sign In</Text>

      <View className="flex-1 px-6">
        <FormProvider {...form}>
          <View className="flex flex-col gap-4">
            <Controller
              control={form.control}
              name="email"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <View>
                    <Label
                      className={cn(error && "text-destructive", "pb-2.5")}
                      nativeID="emailLabel"
                    >
                      Email address
                    </Label>
                    <Input
                      placeholder=""
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
                        className={"px-0.5 py-2 text-sm text-destructive"}
                        role="alert"
                      >
                        {error?.message}
                      </Animated.Text>
                    )}
                  </View>
                );
              }}
            />

            <Controller
              control={form.control}
              name="password"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <View>
                    <Label
                      className={cn(error && "text-destructive", "pb-2.5")}
                      nativeID="passwordLabel"
                    >
                      Password
                    </Label>
                    <Input
                      placeholder=""
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      accessibilityLabel="Password"
                      accessibilityLabelledBy="passwordLabel"
                      secureTextEntry={true}
                    />
                    {error && (
                      <Animated.Text
                        entering={FadeInDown}
                        exiting={FadeOutUp.duration(275)}
                        className={"px-0.5 py-2 text-sm text-destructive"}
                        role="alert"
                      >
                        {error?.message}
                      </Animated.Text>
                    )}
                  </View>
                );
              }}
            />
          </View>
        </FormProvider>
      </View>
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
  );
};

export { SignInForm };
