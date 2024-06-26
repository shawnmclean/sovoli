import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const RNText = () => (
  <View style={styles.container}>
    <Text style={styles.redText}>Text styled with</Text>
    <Text style={styles.skyText}> default RN Stylesheet</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  redText: {
    color: "red",
    fontSize: 16,
    letterSpacing: 0.25,
    marginVertical: 2,
  },
  skyText: {
    color: "skyblue",
    fontSize: 16,
    letterSpacing: 0.25,
    marginVertical: 2,
  },
});
