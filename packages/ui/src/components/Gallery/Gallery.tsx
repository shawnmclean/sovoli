import * as React from "react";
import { View, Dimensions, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  FadeIn,
} from "react-native-reanimated";
import { Image } from "../image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function Gallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const translateX = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  return (
    <View className="flex-1 justify-center items-center border-border border-1">
      <ScrollView horizontal pagingEnabled className="flex-row w-full">
        {images.map((image, index) => (
          <View key={index} className="w-full justify-center items-center">
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={200}
              className="rounded-lg"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
