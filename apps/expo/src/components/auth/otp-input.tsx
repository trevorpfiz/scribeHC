import type { RefObject } from "react";
import { TextInput, View } from "react-native";

import { cn } from "~/lib/utils";

interface OTPInputProps {
  codes: string[];
  refs: RefObject<TextInput>[];
  errorMessages: string[] | undefined;
  onChangeCode: (text: string, index: number) => void;
}

function OTPInput({ codes, refs, errorMessages, onChangeCode }: OTPInputProps) {
  return (
    <View className="flex w-full flex-row justify-between">
      {codes.map((code, index) => (
        <TextInput
          key={index}
          autoComplete="one-time-code"
          enterKeyHint="next"
          className={cn(
            "text-md h-[48] w-[48] rounded-lg bg-[#94a3b8] px-2 py-1 text-center focus:border focus:border-[#fff] ",
            errorMessages !== undefined
              ? "border border-[#ef4444] text-[#ef4444]"
              : "text-[#fff]",
          )}
          inputMode="numeric"
          onChangeText={(text: string) => onChangeCode(text, index)}
          value={code}
          maxLength={index === 0 ? codes.length : 1}
          ref={refs[index]}
          onKeyPress={({ nativeEvent: { key } }) => {
            if (key === "Backspace" && index > 0) {
              onChangeCode("", index - 1);
              refs[index - 1]!.current!.focus();
            }
          }}
        />
      ))}
    </View>
  );
}

export { OTPInput };
