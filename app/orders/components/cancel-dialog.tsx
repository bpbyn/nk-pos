import { Button } from '@/components/ui/button';
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

type CancelDialogProps = {
  onCancel: () => void;
};

export default function CancelDialog({ onCancel }: CancelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Cancel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Order Cancellation</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your order? This action cannot be undone.
          </DialogDescription>
          <DialogFooter className="gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(!isOpen)}>
              No, Keep My Order
            </Button>
            <Button type="button" variant="destructive" onClick={onCancel}>
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
