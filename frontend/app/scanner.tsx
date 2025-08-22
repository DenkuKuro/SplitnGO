import { View, Text, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export default function Scanner() {
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused?.() ?? true;
  const [permission, requestPermission] = useCameraPermissions();



  // Ask once on mount if we can
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) return <View style={{ flex: 1 }} />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: "#00CEC8", justifyContent: "center", alignItems: "center" }}>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "#2563EB", marginTop: 8 }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePictureAndSend = async () => {
    try {
      // @ts-ignore (CameraView has takePictureAsync in SDK 50/51)
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });
      console.log("Photo taken", photo?.uri);
      if (!photo?.uri) {
        Alert.alert("Capture failed");
        return;
      }
      // TODO: send to backend as multipart/form-data
      // await sendPicture(photo.uri);
    } catch (e) {
      console.warn("takePictureAndSend error", e);
      Alert.alert("Error", String(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#00CEC8" }}>
      {/* Camera preview */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        active={isFocused}                 // ensure camera runs only when visible
      />

      {/* Overlay controls OUTSIDE the CameraView so touches are not swallowed */}
      <View style={{ position: "absolute", bottom: 30, alignSelf: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={takePictureAndSend}
          activeOpacity={0.7}
          style={{
            padding: 15,
            borderRadius: 50,
            borderWidth: 5,
            borderColor: "#FFF",
            width: 75,
            height: 75,
          }}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        />
        <TouchableOpacity
          style={{ backgroundColor: "#2563EB", padding: 12, borderRadius: 8, width: 160, marginTop: 12 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
