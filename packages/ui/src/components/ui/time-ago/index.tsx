import React from "react";

import { Text } from "../text"; // Assuming this is the custom Text component you shared
import { getTimeAgo } from "./getTimeAgo";

// Define the props for the TimeAgo component
export interface Props extends React.ComponentPropsWithoutRef<typeof Text> {
  datetime: Date;
}

// Correctly forward the ref using React.forwardRef
export const TimeAgo = React.forwardRef<React.ElementRef<typeof Text>, Props>(
  ({ datetime, className, ...props }, ref) => {
    const { timeAgo } = getTimeAgo(datetime);

    return (
      <Text
        ref={ref} // Forward the ref to the custom Text component
        className={className} // Allow className for NativeWind styling
        {...props} // Spread any additional props (e.g., onClick, etc.)
      >
        {timeAgo}
      </Text>
    );
  },
);

TimeAgo.displayName = "TimeAgo";
