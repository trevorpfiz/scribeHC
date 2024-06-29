import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import colors from "tailwindcss/colors";

import WaveformAnimation from "~/components/recording/waveform";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/chevron-left";
import { Loader2 } from "~/lib/icons/loader-2";
import { getFormattedDateTime } from "~/lib/utils";
import { api } from "~/utils/api";
import { getBaseUrl } from "~/utils/base-url";

export default function RecordScreen() {
  const { getToken } = useAuth();
  const router = useRouter();

  const SERVER_URL = getBaseUrl(8000);

  const [recording, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [uploading, setUploading] = useState(false);

  const metering = useSharedValue(-160);

  const utils = api.useUtils();
  const createNote = api.note.create.useMutation({
    onSuccess: async () => {
      await utils.note.invalidate();
      setUploading(false);
      router.replace("/(app)/dashboard");
    },
    onError: (err) => {
      console.error("Failed to create note", err);
      setUploading(false);
      alert("Processing failed. Please try again.");
    },
  });

  useEffect(() => {
    startRecording();
    return () => {
      discardRecording();
    };
  }, []);

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

  async function discardRecording() {
    console.log("Discarding recording..");
    setRecording(undefined);
    metering.value = -160; // reset metering
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    console.log("Recording discarded");
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    metering.value = -160; // reset metering
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI() ?? "";
    console.log("Recording stopped and stored at", uri);

    processRecording(uri);
  }

  async function processRecording(uri: string) {
    const filetype = uri.split(".").pop();
    console.log("Filetype:", filetype);
    const filename = uri.split("/").pop();
    console.log("Filename:", filename);
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: `audio/mp4`,
      name: filename,
    } as unknown as File);

    setUploading(true);

    try {
      const authToken = await getToken();

      if (!authToken) {
        throw new Error("No auth token found");
      }

      const response = await fetch(`${SERVER_URL}/v1/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`,
        );
      }

      const responseData = await response.json();
      console.log("Upload successful:", responseData.message || responseData);

      const currentDate = getFormattedDateTime();
      createNote.mutate({
        title: `SOAP note - ${currentDate}`,
        content: responseData.content,
        transcript: responseData.transcription,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.blue[200] }}>
      <View className="flex-1 justify-between px-8 py-4">
        <View className="w-full flex-row items-center justify-between">
          <View className="flex-1">
            <Link
              href="/(app)/dashboard"
              asChild
              onPress={() => {
                discardRecording();
              }}
            >
              <Button
                size={"icon"}
                className="bg-transparent active:opacity-50"
              >
                <ChevronLeft color="black" size={48} />
              </Button>
            </Link>
          </View>

          <View className="text-center">
            {!uploading && <Text>Recording...</Text>}
            {uploading && <Text>Processing...</Text>}
          </View>

          <View className="flex-1" />
        </View>

        <View className="flex-1 items-center">
          {uploading ? (
            <View className="flex-1 items-center justify-center">
              <Loader2
                size={48}
                color="black"
                strokeWidth={3}
                className="animate-spin"
              />
            </View>
          ) : (
            <WaveformAnimation metering={metering} />
          )}
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
