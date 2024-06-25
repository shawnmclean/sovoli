import { StyleSheet, Text, View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
// import { Button } from "@sovoli/ui/components/button";

export default function Native() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Native</Text>
      {/* <Button
        onClick={() => {
          console.log("Pressed!");
          Alert.alert("Pressed!");
        }}
        text="Boop"
      /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 36,
  },
});
