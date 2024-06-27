import { useState } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { Link } from "expo-router";
import colors from "tailwindcss/colors";

import WaveformAnimation from "~/components/recording/waveform";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/chevron-left";

export default function RecordScreen() {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const metering = useSharedValue(-160);

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
        undefined,
        200, // interval between calls to onRecordingStatusUpdate
      );
      setRecording(recording);
      console.log("Recording started");

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.metering !== undefined) {
          console.log("Metering", status.metering);
          metering.value = status.metering;
        }
      });
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    metering.value = -160; // reset metering
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.blue[200] }}>
      <View className="flex-1 justify-between px-8 py-4">
        <View className="w-full flex-row items-center justify-between">
          <View className="flex-1">
            <Link href="/(app)/dashboard" asChild>
              <Button
                size={"icon"}
                className="bg-transparent active:opacity-50"
              >
                <ChevronLeft color="black" size={48} />
              </Button>
            </Link>
          </View>

          <View className="text-center">
            {recording ? <Text>Recording</Text> : <Text>Tap to record</Text>}
          </View>

          <View className="flex-1" />
        </View>

        <View className="flex-1 items-center">
          <WaveformAnimation metering={metering} />
        </View>

        <View className="items-center">
          <Button
            className="native:w-24 native:h-24 rounded-full border-[3px] border-black bg-transparent active:scale-90 active:opacity-50"
            onPress={recording ? stopRecording : startRecording}
          >
            <View className="rounded-2xl bg-pink-500 p-6" />
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
