import * as React from "react";
import { View } from "react-native";
import { Link } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/utils/api";

export default function Dashboard() {
  const { data } = api.auth.me.useQuery();
  console.log("data", data);

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-secondary/30 p-6">
      <Text>Dashboard</Text>
      <Link href={{ pathname: "/(app)/record" }} asChild>
        <Button>
          <Text>record</Text>
        </Button>
      </Link>
      <Link href={{ pathname: "/(app)/toggle" }} asChild>
        <Button>
          <Text>toggle</Text>
        </Button>
      </Link>
    </View>
  );
}
