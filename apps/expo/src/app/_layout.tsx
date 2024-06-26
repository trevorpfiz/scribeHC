/* eslint-disable @typescript-eslint/no-floating-promises */

import "../global.css";
import "@bacons/text-decoder/install";

import type { Theme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";

// import * as SystemUI from "expo-system-ui";

import { HeaderCloseButton } from "~/components/header";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/use-color-scheme";
import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/cache";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

const InitialLayout = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inAppGroup = segments[0] === "(app)";

    console.log("inAppGroup", inAppGroup, "isSignedIn", isSignedIn);

    if (isSignedIn && !inAppGroup) {
      console.log("replace", isSignedIn);

      if (router.canDismiss()) {
        router.dismiss();
      }
      router.replace("/(app)/dashboard");
    } else if (!isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          presentation: "modal",
          title: "Sign Up",
          headerTitle: "",
          headerLeft: HeaderCloseButton,
        }}
      />
      <Stack.Screen
        name="signin"
        options={{
          presentation: "modal",
          title: "Sign In",
          headerTitle: "",
          headerLeft: HeaderCloseButton,
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          presentation: "modal",
          title: "Reset Password",
          headerTitle: "",
          headerLeft: HeaderCloseButton,
        }}
      />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
};

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        setAndroidNavigationBar(colorScheme);
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      setAndroidNavigationBar(colorTheme);
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, [colorScheme, setColorScheme]);

  // useEffect(() => {
  //   if (isDarkColorScheme) {
  //     SystemUI.setBackgroundColorAsync("white");
  //   } else {
  //     SystemUI.setBackgroundColorAsync("black");
  //   }
  // }, [isDarkColorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />

          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
              <InitialLayout />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}
