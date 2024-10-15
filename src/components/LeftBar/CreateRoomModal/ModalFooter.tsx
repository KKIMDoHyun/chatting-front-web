import React from "react";

type ModalFooterProps = {
  closeModal: () => void;
  handleCreate: () => void;
  isCreateDisabled: boolean;
};

export const ModalFooter: React.FC<ModalFooterProps> = ({
  closeModal,
  handleCreate,
  isCreateDisabled,
}) => (
  <div className="mt-6 flex w-full justify-end space-x-3">
    <button
      onClick={closeModal}
      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      취소
    </button>
    <button
      onClick={handleCreate}
      disabled={isCreateDisabled}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300"
    >
      생성하기
    </button>
  </div>
);
