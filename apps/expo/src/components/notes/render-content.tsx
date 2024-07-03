import React from "react";
import { Linking } from "react-native";

import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

// Custom component to render different content types
const RenderContent = (props: { content: string }) => {
  const { content } = props;

  if (!content) return null;

  let contentJSON;

  try {
    contentJSON = JSON.parse(content);
  } catch {
    // Handle plain text content
    contentJSON = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        },
      ],
    };
  }

  return contentJSON.content.map((block, index) => {
    switch (block.type) {
      case "heading":
        return (
          <Text key={index} className="py-2 text-lg font-semibold">
            {block.content.map((textBlock, idx) => (
              <Text key={idx}>{textBlock.text}</Text>
            ))}
          </Text>
        );
      case "paragraph":
        return (
          <Text key={index} className="py-1">
            {block.content.map((textBlock, idx) => {
              const hasLink =
                textBlock.marks &&
                textBlock.marks.some((mark) => mark.type === "link");
              return (
                <Text
                  key={idx}
                  className={cn(
                    "text-foreground",
                    hasLink ? "text-blue" : "text-foreground",
                  )}
                  onPress={
                    hasLink
                      ? () => {
                          const link = textBlock.marks.find(
                            (mark) => mark.type === "link",
                          );
                          if (link) {
                            Linking.openURL(link.attrs.href);
                          }
                        }
                      : undefined
                  }
                >
                  {textBlock.text}
                </Text>
              );
            })}
          </Text>
        );
      case "text":
        return <Text key={index}>{block.text}</Text>;
      // Add more cases for other types (e.g., codeBlock, orderedList, image)
      default:
        return null;
    }
  });
};

export { RenderContent };
