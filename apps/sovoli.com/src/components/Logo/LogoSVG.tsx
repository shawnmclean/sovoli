import React from "react";

export const LogoSVG = ({
  width = 32,
  height = 32,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 400 400"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Sovoli Logo"
    className={className}
  >
    <defs>
      <linearGradient
        id="logoGradient"
        gradientUnits="userSpaceOnUse"
        x1="11.416"
        y1="224.155"
        x2="388.584"
        y2="177.845"
      >
        <stop offset="0" stopColor="#800080" />
        <stop offset="1" stopColor="#ff00ff" />
      </linearGradient>
    </defs>
    <circle fill="url(#logoGradient)" cx="200" cy="200" r="190" />
    <text
      x="200.28"
      y="218.44193"
      dominantBaseline="middle"
      textAnchor="middle"
      fontFamily="SignPainter, 'Brush Script MT', cursive"
      fontSize="358.529px"
      fill="#fdfdfd"
      style={{ strokeWidth: 1.37896 }}
    >
      S
    </text>
  </svg>
);
