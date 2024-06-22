import React from "react";
import { View } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

import GoogleSvg from "~/components/svg/google-icon";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const ContinueWithOAuth = (props: { provider: "apple" | "google" }) => {
  const { provider } = props;
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: `oauth_${provider}` });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/toggle"),
      });

      if (createdSessionId) {
        void setActive?.({ session: createdSessionId });
      } else {
        // Handle next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  return (
    <View>
      {provider === "google" && (
        <Button
          size="lg"
          className="flex-row items-center gap-2 rounded-xl bg-zinc-600"
          onPress={onPress}
        >
          <GoogleSvg size={20} />
          <Text className="font-semibold text-white">Continue with Google</Text>
        </Button>
      )}
      {provider === "apple" && (
        <Button
          variant="secondary"
          size="lg"
          className="flex-row items-center gap-2 rounded-xl bg-white"
          textClassName="group-active:text-black"
          onPress={onPress}
        >
          <Ionicons name="logo-apple" size={20} />
          <Text className="font-semibold text-black">Continue with Apple</Text>
        </Button>
      )}
    </View>
  );
};

export { ContinueWithOAuth };
