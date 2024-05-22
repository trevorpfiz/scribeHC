import { Pressable, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/moon-star";
import { Sun } from "~/lib/icons/sun";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn } from "~/lib/utils";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  return (
    <Pressable
      onPress={() => {
        const newTheme = isDarkColorScheme ? "light" : "dark";
        setColorScheme(newTheme);
        setAndroidNavigationBar(newTheme);
        AsyncStorage.setItem("theme", newTheme);
      }}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
    >
      {({ pressed }) => (
        <View
          className={cn(
            "web:px-5 aspect-square flex-1 items-start justify-center pt-0.5",
            pressed && "opacity-70",
          )}
        >
          {isDarkColorScheme ? (
            <MoonStar
              className="text-foreground"
              size={23}
              strokeWidth={1.25}
            />
          ) : (
            <Sun className="text-foreground" size={24} strokeWidth={1.25} />
          )}
        </View>
      )}
    </Pressable>
  );
}
