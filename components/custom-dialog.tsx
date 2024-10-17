import { Button, ButtonProps } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';

type ButtonVariant = NonNullable<ButtonProps['variant']>;

type CustomDialogProps = {
  shouldOpen?: boolean;
  btnTitle?: string;
  dlgTitle?: string;
  dlgDesc?: string;
  btnYesDesc?: string;
  btnNoDesc?: string;
  btnYesVariant?: ButtonVariant;
  btnNoVariant?: ButtonVariant;
  disabled?: boolean;
  onApprove: () => void;
  onDecline?: () => void;
};

export default function CustomDialog({
  btnTitle = 'Cancel',
  dlgTitle,
  dlgDesc,
  btnYesDesc,
  btnNoDesc,
  btnYesVariant = 'secondary',
  btnNoVariant = 'destructive',
  disabled = false,
  shouldOpen,
  onApprove,
  onDecline,
}: CustomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (shouldOpen) {
      setIsOpen(true);
    }
  }, [shouldOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        onDecline?.();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" disabled={disabled}>
          {btnTitle}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dlgTitle}</DialogTitle>
          <DialogDescription>{dlgDesc}</DialogDescription>
          <DialogFooter className="gap-4 pt-4">
            <Button
              type="button"
              variant={btnYesVariant}
              onClick={() => {
                setIsOpen(false);
                onDecline?.();
              }}
            >
              {btnNoDesc}
            </Button>
            <Button
              type="button"
              variant={btnNoVariant}
              onClick={() => {
                setIsOpen(false);
                onApprove?.();
              }}
            >
              {btnYesDesc}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
