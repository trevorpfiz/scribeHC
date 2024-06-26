import { useState } from "react";
import { View } from "react-native";
import { Audio } from "expo-av";
import { Link } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function RecordScreen() {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  return (
    <View className="flex-1 items-center justify-between bg-blue-200 px-12 py-24">
      <Text>Record</Text>
      <Button
        className="native:w-24 native:h-24 rounded-full border-[3px] border-black bg-transparent active:scale-90 active:opacity-50"
        onPress={recording ? stopRecording : startRecording}
      >
        <View className="rounded-2xl bg-pink-500 p-6" />
      </Button>
    </View>
  );
}
