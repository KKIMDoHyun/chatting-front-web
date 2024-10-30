import React, { ReactElement } from "react";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

import { CustomModalProps } from "@typings/Modal";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@components/ui";

import ModalContext from "./ModalContext";

export const ModalProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    content: ReactElement;
    isShowClose: boolean;
    isBackDrop: boolean;
  }>({
    isOpen: false,
    content: <></>,
    isShowClose: true,
    isBackDrop: true,
  });

  const showCustomModal = ({
    displayComponent,
    isShowClose = true,
    isBackDrop = true,
  }: CustomModalProps) => {
    setModalState({
      isOpen: true,
      content: displayComponent,
      isShowClose,
      isBackDrop,
    });
  };

  const closeCustomModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleOpenChange = (open: boolean) => {
    // isBackDrop이 false일 때는 닫히지 않도록 처리
    if (!open && !modalState.isBackDrop) {
      return;
    }
    if (!open) {
      closeCustomModal();
    }
  };

  return (
    <ModalContext.Provider
      value={{
        showCustomModal,
        closeCustomModal,
      }}
    >
      <Dialog open={modalState.isOpen} onOpenChange={handleOpenChange}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-[500] bg-black/50" />
          <DialogContent
            className="fixed left-1/2 top-1/2 z-[501] w-fit -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0 shadow-none outline-none"
            showClose={modalState.isShowClose}
          >
            <DialogTitle className="hidden" />
            <DialogDescription className="hidden" />
            {modalState.content}
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {children}
    </ModalContext.Provider>
  );
};
