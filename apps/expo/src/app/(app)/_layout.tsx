import { TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import { ThemeToggle } from "~/components/theme-toggle";
import { LogOut } from "~/lib/icons/log-out";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerLeft: () => <SignOut />,
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Stack.Screen
        name="record"
        options={{
          title: "Record",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notes/[noteId]"
        options={{
          title: "Note",
        }}
      />
    </Stack>
  );
};

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        signOut();
      }}
    >
      <LogOut size={23} strokeWidth={1.5} className="text-foreground" />
    </TouchableOpacity>
  );
};

export default Layout;
