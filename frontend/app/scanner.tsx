import { View, Text, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions() || null;


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
        style={{ 
          width: "90%", 
          height: "70%", 
          borderRadius: 15,
          overflow: "hidden"
        }} 
        facing="back"
      />
      <TouchableOpacity 
        style={{ 
          backgroundColor: "#007AFF", 
          padding: 15, 
          borderRadius: 8, 
          minWidth: 120,
          marginTop: 30
        }} 
        onPress={() => {}}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" }}>
          Scan
        </Text>
      </TouchableOpacity>
    </View>
  );
}