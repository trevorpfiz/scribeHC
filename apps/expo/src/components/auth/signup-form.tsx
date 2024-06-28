import type { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { SignUp } from "@shc/validators";
import { SignUpSchema } from "@shc/validators";

import { OTPVerification } from "~/components/auth/otp-verification";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Eye } from "~/lib/icons/eye";
import { EyeOff } from "~/lib/icons/eye-off";
import { Loader2 } from "~/lib/icons/loader-2";
import { cn } from "~/lib/utils";

const SignUpForm = () => {
  const { signUp, isLoaded } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUp>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      console.log("signup create done");

      // Send the email for verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      console.log("signup email sent");

      // change the UI to our pending section
      setPendingVerification(true);
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    console.log("handleVerificationSuccess");
  };

  return (
    <View className="flex-1 justify-center gap-8">
      <Text className="text-3xl font-bold">Create account</Text>

      {!pendingVerification && (
        <View className="flex-1 flex-col gap-12">
          <FormProvider {...form}>
            <View className="flex flex-col gap-6">
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
                      placeholder=""
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
                      Password
                    </Label>
                    <View className="flex h-14 flex-row items-center gap-2">
                      <Input
                        placeholder=""
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        accessibilityLabel="Password"
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
            </View>
          </FormProvider>

          <View>
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
                    Signing up...
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-medium text-primary-foreground">
                  Sign Up
                </Text>
              )}
            </Button>
          </View>
        </View>
      )}

      {pendingVerification && (
        <OTPVerification onSuccess={handleVerificationSuccess} />
      )}
    </View>
  );
};

export { SignUpForm };
