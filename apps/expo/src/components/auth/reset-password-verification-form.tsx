import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { ResetPassword } from "@shc/validators";
import { ResetPasswordSchema } from "@shc/validators";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Eye } from "~/lib/icons/eye";
import { EyeOff } from "~/lib/icons/eye-off";
import { Loader2 } from "~/lib/icons/loader-2";
import { cn } from "~/lib/utils";

const ResetPasswordVerificationForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const { signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<ResetPassword>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  const onSubmit = async (data: ResetPassword) => {
    setIsLoading(true);
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        onSuccess();
      } else {
        setError("Failed to reset password");
      }
    } catch (err: unknown) {
      setError(err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <View className="flex-1 flex-col gap-6">
        <Controller
          control={form.control}
          name="code"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View className="flex-col gap-2">
              <Label
                className={cn(error && "text-destructive")}
                nativeID="codeLabel"
              >
                Reset Code
              </Label>
              <Input
                placeholder="Enter the reset code"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                accessibilityLabel="Reset Code"
                accessibilityLabelledBy="codeLabel"
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

        <Controller
          control={form.control}
          name="password"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View className="flex-col gap-2">
              <Label
                className={cn(error && "text-destructive")}
                nativeID="passwordLabel"
              >
                New Password
              </Label>
              <View className="flex h-14 flex-row items-center gap-2">
                <Input
                  placeholder="Enter new password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  accessibilityLabel="New Password"
                  accessibilityLabelledBy="passwordLabel"
                  secureTextEntry={!showPassword}
                  className="native:h-full flex-1 pr-12"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-0 px-3 py-3"
                >
                  {showPassword ? (
                    <EyeOff
                      className="text-foreground"
                      size={23}
                      strokeWidth={1.25}
                    />
                  ) : (
                    <Eye
                      className="text-foreground"
                      size={23}
                      strokeWidth={1.25}
                    />
                  )}
                </TouchableOpacity>
              </View>
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
          disabled={isLoading}
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center gap-3">
              <Loader2
                size={24}
                color="white"
                strokeWidth={3}
                className="animate-spin"
              />
              <Text className="text-xl font-medium text-primary-foreground">
                Resetting...
              </Text>
            </View>
          ) : (
            <Text className="text-xl font-medium text-primary-foreground">
              Set New Password
            </Text>
          )}
        </Button>
        {error && <Text className="mt-4 text-red-500">{error}</Text>}
      </View>
    </FormProvider>
  );
};

export { ResetPasswordVerificationForm };
