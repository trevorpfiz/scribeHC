import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { RenderContent } from "~/components/notes/render-content";
import { Text } from "~/components/ui/text";
import { Loader2 } from "~/lib/icons/loader-2";
import { api } from "~/utils/api";

export default function NotePage() {
  const { noteId } = useLocalSearchParams();

  const { isPending, isError, data, error } = api.note.byId.useQuery({
    id: noteId as string,
  });

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center pb-48">
        <Loader2
          size={48}
          strokeWidth={3}
          className="animate-spin text-foreground"
        />
      </View>
    );
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View className="flex-1 bg-secondary/30">
      <Stack.Screen
        options={{
          title: data?.note?.title,
        }}
      />

      <View className="flex-1 gap-8 p-4">
        <View className="flex-col gap-2">
          <View className={"text-wrap break-all rounded-lg bg-secondary p-4"}>
            <RenderContent content={data?.note?.content ?? "N/A"} />
          </View>
        </View>
        <View className="flex-col gap-4">
          <Text className="text-lg font-semibold">Transcript</Text>
          <View className={"text-wrap break-all rounded-lg bg-secondary p-4"}>
            <Text>{data?.note?.transcript}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
