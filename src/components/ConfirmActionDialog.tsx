import React, { useRef } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from '@chakra-ui/react';

interface ConfirmActionDialogProps {
  isOpen: boolean
  onClose: () => void
  action: () => void
  title: string
  description: string
  primary: string,
  isLoading: boolean
}

function ConfirmActionDialog({ isOpen, onClose, action, title, description, primary, isLoading }: ConfirmActionDialogProps) {

  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="2xl" fontStyle="italic" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            {description}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button mr="4" ref={cancelRef} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="red" isLoading={isLoading} onClick={action}>
              {primary}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ConfirmActionDialog;