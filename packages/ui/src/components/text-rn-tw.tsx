"use client";

import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const RNTextTW = () => (
  <View className="flex flex-row flex-wrap">
    <Text className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-sky-400">
      RN Text styled with default tailwind from package
    </Text>
  </View>
);
