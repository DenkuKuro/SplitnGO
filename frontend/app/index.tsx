import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00CEC8",
      }}
    >
      <Text>Welcome to SplitNGo!</Text>
      <Link href="./scanner" asChild>
        <TouchableOpacity className="bg-blue-500 p-4 rounded-md w-40 mt-4" onPress={() => {}}>
          <Text className="text-white text-center">Start</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
