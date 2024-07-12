import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Image } from "../image";

const width = Dimensions.get("window").width;

export function Gallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const ref = React.useRef<ICarouselInstance>(null);

  return (
    <View className="flex-1 items-center justify-center">
      <Carousel
        ref={ref}
        width={width}
        height={width / 2}
        data={images}
        renderItem={({ index }) => (
          <View className="w-full max-h-[480px]" style={{ aspectRatio: 1 }}>
            <Image
              fill
              src={images[index].src}
              alt={images[index].alt}
              className="w-full h-full object-contain"
            />
          </View>
        )}
      />
    </View>
  );
}
