import { View, Text, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect, useRef } from "react";

export default function Scanner() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions() || null;
  const [photo, setPhoto] = useState<string | null>(null);

  // Send picture to backend
  const sendPicture = async () => {
    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: JSON.stringify({ photo }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  }

  // Take picture and send to backend
  const takePictureAndSend = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    setPhoto(photo?.uri || null);
    // sendPicture();
  }


  // Automatically request permission when component mounts
  useEffect(() => {
    if (permission && !permission.granted) {
        requestPermission();
    }
  }, [permission, requestPermission]);


  if (permission === undefined || permission === null) {
    return <View />;
  }

  if (!permission.granted) {
    return (
        <View style={{ flex: 1, backgroundColor: "#00CEC8", justifyContent: "center", alignItems: "center" }}>
            <Text>We need your permission to show the camera</Text>
            <TouchableOpacity onPress={requestPermission}>
                <Text>Grant Permission</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#00CEC8", justifyContent: "center", alignItems: "center" }}>
      <CameraView
        ref={cameraRef}
        style={{ 
          width: "90%", 
          height: "80%", 
          borderRadius: 15,
          overflow: "hidden"
        }} 
        facing="back"
      >
        <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "flex-end", alignItems: "center" }}>
          <TouchableOpacity 
          style={{
            padding: 15, 
            borderRadius: 100,
            borderWidth: 5,
            borderColor: "#FFF",
            width: 75,
            height: 75,
            margin: 30
          }} 
          onPress={() => {takePictureAndSend()}}
        >
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}