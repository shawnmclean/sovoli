import { tv } from "tailwind-variants";

const gradientBorderButton = tv({
  base: "font-semibold border-2 border-transparent [background-image:linear-gradient(hsl(var(--heroui-background)),hsl(var(--heroui-background))),linear-gradient(to_right,hsl(var(--heroui-danger)),hsl(var(--heroui-primary)))] [background-origin:border-box] [background-clip:padding-box,border-box] text-foreground",
});

export { gradientBorderButton };
