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
import React, { useState } from 'react';

type ButtonVariant = NonNullable<ButtonProps['variant']>;

type CustomDialogProps = {
  btnTitle?: string;
  dlgTitle?: string;
  dlgDesc?: string;
  btnYesDesc?: string;
  btnNoDesc?: string;
  btnYesVariant?: ButtonVariant;
  btnNoVariant?: ButtonVariant;
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
  onApprove,
  onDecline,
}: CustomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">{btnTitle}</Button>
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
                setIsOpen(!isOpen);
                onDecline?.();
              }}
            >
              {btnNoDesc}
            </Button>
            <Button type="button" variant={btnNoVariant} onClick={onApprove}>
              {btnYesDesc}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
