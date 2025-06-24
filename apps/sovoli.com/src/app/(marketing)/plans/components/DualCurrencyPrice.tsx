export interface DualCurrencyPriceProps {
  usdPrice?: number;
  gydPrice?: number;
  className?: string;
}

export function DualCurrencyPrice({
  usdPrice,
  gydPrice,
  className = "",
}: DualCurrencyPriceProps) {
  const hasUsd = usdPrice !== undefined;
  const hasGyd = gydPrice !== undefined;
  const showSlash = hasUsd && hasGyd;

  return (
    <span className={className}>
      {hasUsd &&
        usdPrice.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      {showSlash && " / "}
      {hasGyd &&
        gydPrice.toLocaleString("en-US", {
          style: "currency",
          currency: "GYD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
    </span>
  );
}
