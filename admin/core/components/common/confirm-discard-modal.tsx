import { FC } from "react";
// heroui
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import Link from "next/link";

interface IConfirmDiscardModal {
  isOpen: boolean;
  handleClose: () => void;
  onOpenChange: (open: boolean) => void;
  onDiscardHref: string;
}

export const ConfirmDiscardModal: FC<IConfirmDiscardModal> = (props) => {
  const { isOpen, handleClose, onOpenChange, onDiscardHref } = props;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled
      placement="center"
    >
      <ModalContent>
        <ModalHeader>You have unsaved changes</ModalHeader>
        <ModalBody>
          <p>Changes you made will be lost if you go back. Do you wish to go back?</p>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleClose} size="sm" color="primary">
            Keep editing
          </Button>
          <Button as={Link} href={onDiscardHref} size="sm" color="danger">
            Go back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
