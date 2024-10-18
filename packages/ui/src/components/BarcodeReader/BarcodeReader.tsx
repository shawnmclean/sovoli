"use client";

import { BarcodeFormat } from "@zxing/library";
import { useZxing } from "react-zxing";

export interface BarcodeReaderProps {
  onISBNFound: (isbn: string) => void;
}

export function BarcodeReader({ onISBNFound }: BarcodeReaderProps) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      const format = result.getBarcodeFormat() as BarcodeFormat;

      // Only consider EAN-13 (ISBN)
      if (format === BarcodeFormat.EAN_13) {
        // Further check to ensure it's an ISBN by looking for "978" or "979" prefix
        if (text.startsWith("978") || text.startsWith("979")) {
          onISBNFound(text);
        }
      }
    },
  });

  return (
    <>
      <video ref={ref} />
    </>
  );
}
