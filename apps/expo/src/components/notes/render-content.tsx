import React from "react";
import { Linking } from "react-native";

import { Text } from "~/components/ui/text";

// Custom component to render different content types
const RenderContent = (props: { content: string }) => {
  const { content } = props;

  if (!content) return null;

  const contentJSON = JSON.parse(content);

  return contentJSON.content.map((block, index) => {
    switch (block.type) {
      case "heading":
        return (
          <Text
            key={index}
            style={{
              fontSize: block.attrs.level === 2 ? 24 : 20,
              fontWeight: "bold",
              marginVertical: 8,
            }}
          >
            {block.content.map((textBlock, idx) => (
              <Text key={idx}>{textBlock.text}</Text>
            ))}
          </Text>
        );
      case "paragraph":
        return (
          <Text key={index} style={{ fontSize: 16, marginVertical: 4 }}>
            {block.content.map((textBlock, idx) => (
              <Text
                key={idx}
                style={{
                  color:
                    textBlock.marks &&
                    textBlock.marks.some((mark) => mark.type === "link")
                      ? "blue"
                      : "black",
                }}
                onPress={() => {
                  if (textBlock.marks) {
                    const link = textBlock.marks.find(
                      (mark) => mark.type === "link",
                    );
                    if (link) {
                      Linking.openURL(link.attrs.href);
                    }
                  }
                }}
              >
                {textBlock.text}
              </Text>
            ))}
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
