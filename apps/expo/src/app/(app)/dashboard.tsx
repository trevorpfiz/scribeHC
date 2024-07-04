import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { ItemCard } from "~/components/cards/item-card";
import { Button } from "~/components/ui/button";
import { Loader2 } from "~/lib/icons/loader-2";
import { Mic } from "~/lib/icons/mic";
import { api } from "~/utils/api";

export default function Dashboard() {
  const { data, isPending } = api.note.byUser.useQuery();

  const router = useRouter();

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <View className="flex-1 bg-secondary/30">
        {isPending ? (
          <View className="flex-1 items-center justify-center pb-48">
            <Loader2
              size={48}
              strokeWidth={3}
              className="animate-spin text-foreground"
            />
          </View>
        ) : (
          <>
            {data?.notes.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-lg text-gray-700 dark:text-gray-300">
                  Record a conversation!
                </Text>
              </View>
            ) : (
              <FlashList
                data={data?.notes}
                renderItem={({ item }) => (
                  <ItemCard
                    title={item.title}
                    preview={item.transcript ?? "N/A"}
                    onPress={() => {
                      router.push(`/(app)/notes/${item.id}`);
                    }}
                  />
                )}
                estimatedItemSize={200}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View className="h-4" />}
                contentContainerStyle={{
                  paddingBottom: 16,
                  paddingTop: 16,
                  paddingHorizontal: 16,
                }}
              />
            )}
          </>
        )}
        <View className="absolute bottom-4 left-4 right-4 h-[12%] flex-row justify-around rounded-3xl bg-gray-200 p-4 dark:bg-gray-800">
          <View className="flex-1 px-20">
            <Link href={{ pathname: "/(app)/record" }} asChild>
              <Button
                size="lg"
                className="mx-2 flex-1 items-center rounded-full active:opacity-50"
              >
                <Mic size={40} strokeWidth={1.5} className="text-secondary" />
              </Button>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
