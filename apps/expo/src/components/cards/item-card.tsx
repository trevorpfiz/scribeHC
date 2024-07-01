import { TouchableOpacity, View } from "react-native";

import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { ChevronRight } from "~/lib/icons/chevron-right";

const ItemCard = ({
  title,
  preview,
  onPress,
}: {
  title: string;
  preview: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      className="border-none"
    >
      <Card className="flex-1 flex-row items-center justify-between gap-8 bg-secondary py-8 pl-8 pr-4 shadow-none">
        <View className="flex-1 flex-col justify-between">
          <Text className="text-lg font-medium">{title}</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            className="flex-1 text-sm opacity-50"
          >
            {preview}
          </Text>
        </View>
        <ChevronRight
          size={20}
          strokeWidth={2}
          className="flex-shrink-0 text-foreground"
        />
      </Card>
    </TouchableOpacity>
  );
};

export { ItemCard };
