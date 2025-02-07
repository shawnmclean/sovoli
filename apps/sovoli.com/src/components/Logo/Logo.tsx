export const Logo = () => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
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
      <g>
        <circle fill="url(#logoGradient)" cx="200" cy="201" r="190" />
        <text
          x="129.97"
          y="293.189"
          style={{
            fontFamily: "SignPainter",
            fontSize: "306.667px",
            fill: "#fdfdfd",
          }}
        >
          S
        </text>
      </g>
    </svg>
  );
};
