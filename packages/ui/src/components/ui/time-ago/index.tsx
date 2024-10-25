import React from "react";

import { getTimeAgo } from "./getTimeAgo";

export interface Props extends React.ComponentPropsWithoutRef<"time"> {
  datetime: Date;
  className?: string;
}
export const TimeAgo = React.forwardRef<HTMLTimeElement, Props>(
  ({ datetime, className, ...props }, ref) => {
    const { timeAgo, isoString, fullDate } = getTimeAgo(datetime);
    return (
      <time
        className={className}
        ref={ref}
        dateTime={isoString}
        title={fullDate}
        {...props}
      >
        {timeAgo}
      </time>
    );
  },
);
