import { env } from "~/env";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const FB_PIXEL_ID = env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";

declare global {
  interface Window {
    fbq?: (
      command: string,
      eventName?: string,
      parameters?: Record<string, unknown>,
    ) => void;
  }
}

export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const event = (name: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

export const track = (name: string, options: Record<string, unknown> = {}) => {
  event(name, options);
};
