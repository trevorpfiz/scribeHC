import type { RequestPasswordReset } from "@shc/validators";
import React, { useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestPasswordResetSchema } from "@shc/validators";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { ResetPasswordVerificationForm } from "~/components/auth/reset-password-verification-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Loader2 } from "~/lib/icons/loader-2";
import { cn } from "~/lib/utils";

const ResetPasswordForm = () => {
  const { signIn } = useSignIn();
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<RequestPasswordReset>({
    resolver: zodResolver(RequestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RequestPasswordReset) => {
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err: unknown) {
      setError(err.errors[0].message);
    }
  };

  return (
    <View className="flex-1 justify-center gap-8">
      <Text className="text-3xl font-bold">Reset Password</Text>

      {!successfulCreation && (
        <FormProvider {...form}>
          <View className="flex-1 flex-col gap-6">
            <Controller
              control={form.control}
              name="email"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View className="flex-col gap-2">
                  <Label
                    className={cn(error && "text-destructive")}
                    nativeID="emailLabel"
                  >
                    Email address
                  </Label>
                  <Input
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="Email address"
                    accessibilityLabelledBy="emailLabel"
                    autoCapitalize="none"
                    className="native:h-14"
                  />
                  {error && (
                    <Animated.Text
                      entering={FadeInDown}
                      exiting={FadeOutUp.duration(275)}
                      className="px-1 text-sm text-destructive"
                      role="alert"
                    >
                      {error.message}
                    </Animated.Text>
                  )}
                </View>
              )}
            />
            <Button
              size={"lg"}
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <View className="flex-row items-center justify-center gap-3">
                  <Loader2
                    size={24}
                    color="white"
                    strokeWidth={3}
                    className="animate-spin"
                  />
                  <Text className="text-xl font-medium text-primary-foreground">
                    Sending...
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-medium text-primary-foreground">
                  Send Reset Email
                </Text>
              )}
            </Button>
            {error && <Text className="mt-4 text-red-500">{error}</Text>}
          </View>
        </FormProvider>
      )}

      {successfulCreation && (
        <ResetPasswordVerificationForm
          onSuccess={() => setSuccessfulCreation(false)}
        />
      )}
    </View>
  );
};

export { ResetPasswordForm };
