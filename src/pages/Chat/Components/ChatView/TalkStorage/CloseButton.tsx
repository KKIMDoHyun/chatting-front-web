import { X } from "lucide-react";

import { Button, DrawerClose } from "@components/ui";

export const CloseButton = () => {
  return (
    <DrawerClose asChild className="absolute -left-12 top-2">
      <Button variant="secondary" size="icon">
        <X className="h-5 w-5" />
      </Button>
    </DrawerClose>
  );
};
