import type { ICarouselInstance } from "react-native-reanimated-carousel";
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { COVER_IMAGE_ASPECT_RATIO, window } from "../../lib/constants";
import { Badge } from "../badge";
import { Image } from "../image";
import { Text } from "../text";

const PAGE_WIDTH = window.width;
const MAX_CAROSEL_HEIGHT = 500;

export function Gallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const windowWidth = useWindowDimensions().width;
  const [carouselHeight, setCarouselHeight] = useState<number>(
    Math.min(PAGE_WIDTH / COVER_IMAGE_ASPECT_RATIO, MAX_CAROSEL_HEIGHT),
  );
  const scrollOffsetValue = useSharedValue<number>(0);
  const [index, setIndex] = useState(0);
  const ref = useRef<ICarouselInstance>(null);

  useEffect(() => {
    setCarouselHeight(
      Math.min(windowWidth / COVER_IMAGE_ASPECT_RATIO, MAX_CAROSEL_HEIGHT),
    );
  }, [windowWidth]);

  return (
    <View className="relative">
      <Carousel
        width={windowWidth}
        height={carouselHeight}
        loop={false}
        defaultScrollOffsetValue={scrollOffsetValue}
        style={{ width: "100%" }}
        ref={ref}
        data={images}
        snapEnabled
        onSnapToItem={(index) => {
          setIndex(index);
        }}
        renderItem={({ index }) => {
          const image = images[index];
          if (!image) {
            return <Text>No image</Text>;
          }
          return (
            <View className="h-full w-full">
              <Image fill src={image.src} alt={image.alt} />
            </View>
          );
        }}
      />
      <Badge
        className="absolute bottom-2 right-2 opacity-80"
        variant="secondary"
      >
        <Text>
          {index + 1} / {images.length}
        </Text>
      </Badge>
    </View>
  );
}
