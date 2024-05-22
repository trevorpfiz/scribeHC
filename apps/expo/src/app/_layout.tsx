import "../styles.css";
import "@bacons/text-decoder/install";

import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { AuthAvatar } from "~/components/header";
import { ThemeToggle } from "~/components/theme-toggle";
import { Text } from "~/components/ui/text";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/use-color-scheme";
import { TRPCProvider } from "~/utils/api";
import { supabase } from "~/utils/supabase";

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
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TRPCProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />

          <GestureHandlerRootView style={{ flex: 1 }}>
            {/*
             * The Stack component displays the current page.
             * It also allows you to configure your screens
             */}
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  title: "T3 x Supabase",
                  headerTitle: () => (
                    <Text className="text-3xl font-bold text-muted-foreground">
                      <Text className="text-fuchsia-500">T3</Text>
                      <Text> x </Text>
                      <Text className="text-emerald-400">Supabase</Text>
                    </Text>
                  ),
                  headerLeft: () => <AuthAvatar />,
                  headerRight: () => <ThemeToggle />,
                }}
              />
              {/*
               * Present the profile screen as a modal
               * @see https://expo.github.io/router/docs/guides/modals
               */}
              <Stack.Screen
                name="profile"
                options={{
                  presentation: "modal",
                  title: "Profile",
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </ThemeProvider>
      </TRPCProvider>
    </SessionContextProvider>
  );
}
