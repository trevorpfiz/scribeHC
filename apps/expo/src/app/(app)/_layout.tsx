import { Stack } from "expo-router";

import { ThemeToggle } from "~/components/theme-toggle";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Stack.Screen
        name="record"
        options={{
          title: "Record",
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Stack.Screen
        name="toggle"
        options={{
          title: "Starter Base",
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Stack>
  );
};

export default Layout;
