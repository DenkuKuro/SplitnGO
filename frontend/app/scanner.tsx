import { View, Text, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;


export default function Scanner() {
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();
  const facing = "back";
  const [permission, requestPermission] = useCameraPermissions();



  // Ask once on mount if we can
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Request media library permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

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

  const apiCall = async (photo: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: photo,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);
    console.log(`${API_BASE_URL}/api/upload`);
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    return response;
  };

  const takePictureAndSend = async () => {
    try {
      // @ts-ignore (CameraView has takePictureAsync in SDK 50/51)
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });
      console.log("Photo taken", photo?.uri);

      const response = await apiCall(photo?.uri || "");

      const data = await response.json();

      console.log("Data", data);

      // navigation.navigate("Result", { data });

      if (!photo?.uri) {
        Alert.alert("Capture failed");
        return;
      }
    } catch (e) {
      console.warn("takePictureAndSend error", e);
      Alert.alert("Error", String(e));
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        console.log("Image selected from gallery", result.assets[0].uri);
        // TODO: send to backend as multipart/form-data
        // await sendPicture(result.assets[0].uri);
        const response = await apiCall(result.assets[0].uri);
        const data = await response.json();
        console.log("Data", data);
        // navigation.navigate("item-list", { items: data });
      }
    } catch (e) {
      console.warn("pickImageFromGallery error", e);
      Alert.alert("Error", String(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#00CEC8", justifyContent: "center", alignItems: "center" }}>
      {/* Camera preview */}
      <CameraView
        ref={cameraRef}
        style={{ 
          flex: 1,
          width: "90%",
          marginTop: 60,
          marginBottom: 125,
         }}
        facing={facing}               // ensure camera runs only when visible
      />

      {/* Overlay controls OUTSIDE the CameraView so touches are not swallowed */}
      <View style={{ position: "absolute", bottom: 70, alignSelf: "center", alignItems: "center", gap: 25 }}>
        {/* Camera and Gallery buttons row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 40 }}>
          {/* Gallery button */}
          <TouchableOpacity
            onPress={pickImageFromGallery}
            activeOpacity={0.7}
            style={{
              padding: 15,
              borderRadius: 50,
              borderWidth: 3,
              borderColor: "#FFF",
              width: 60,
              height: 60,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Image
              source={require('../assets/images/gallery.png')}
              style={{ width: 34, height: 34, tintColor: "#FFF" }}
              contentFit="contain"
            />
          </TouchableOpacity>

          {/* Camera capture button */}
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

          {/* Placeholder for symmetry */}
          <View style={{ width: 60, height: 60 }} />
        </View>

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
