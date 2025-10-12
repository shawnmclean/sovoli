"use client";

import { Drawer } from "@sovoli/ui/components/drawer";
import { useRouter } from "next/navigation";
import { SearchDialog } from "../../components/SearchDialog";

export default function SearchPage() {
  const router = useRouter();

  return (
    <Drawer
      scrollBehavior="inside"
      isOpen={true}
      onClose={() => router.push("/")}
      size="full"
      placement="bottom"
      backdrop="opaque"
      hideCloseButton
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
            },
          },
          exit: {
            y: 100,
            opacity: 0,
            transition: {
              duration: 0.3,
            },
          },
        },
      }}
    >
      <SearchDialog />
    </Drawer>
  );
}
