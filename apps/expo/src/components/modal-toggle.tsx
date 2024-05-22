import { Pressable, View } from "react-native";
import { router } from "expo-router";

import { CircleUserRound } from "~/lib/icons/circle-user-round";
import { cn } from "~/lib/utils";

export function ModalToggle() {
  return (
    <Pressable
      onPress={() => {
        router.push("/modal");
      }}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
    >
      {({ pressed }) => (
        <View
          className={cn(
            "web:pl-4 aspect-square flex-1 items-end justify-center pt-0.5",
            pressed && "opacity-70",
          )}
        >
          <CircleUserRound
            className="text-foreground"
            size={24}
            strokeWidth={1.25}
          />
        </View>
      )}
    </Pressable>
  );
}
