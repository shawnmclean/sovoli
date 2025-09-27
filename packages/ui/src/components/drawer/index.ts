// Export custom drawer components
export { Drawer } from "./Drawer";
export type { CustomDrawerProps as DrawerProps } from "./Drawer";
export { DrawerHeader } from "./DrawerHeader";
export type { DrawerHeaderProps } from "./DrawerHeader";

// Re-export other HeroUI drawer components that we don't customize
export {
  DrawerContent,
  DrawerHeader as HeroUIDrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
