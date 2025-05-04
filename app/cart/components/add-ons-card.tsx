import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useOrderStore from '@/lib/store';
import { Extra, OrderExtra, Product } from '@/lib/types';
import { cn, findProduct } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type AddOnsCardProps = {
  productId: Product['id'];
  onAddOnsChange: (addOns: OrderExtra[]) => void;
};

export default function AddOnsCard({ productId, onAddOnsChange }: AddOnsCardProps) {
  const products = useOrderStore((state) => state.products);

  const extras = findProduct<Product, keyof Product>(products, 'id', productId)?.extras;
  const orderDetail = useOrderStore((state) =>
    state.orderDetails.findLast((order) => order.productId === productId)
  );

  const [selectedExtras, setSelectedExtras] = useState<OrderExtra[]>(orderDetail?.extras || []);

  const toggleExtra = (extra: Extra) => {
    const existingIndex = selectedExtras.findIndex((item) => item.extra.id === extra.id);

    if (existingIndex >= 0) {
      // If already selected, remove it
      setSelectedExtras(selectedExtras.filter((item) => item.extra.id !== extra.id));
    } else {
      // If not selected, add it with quantity 1
      setSelectedExtras([...selectedExtras, { extra, quantity: 1 }]);
    }
  };

  // Check if an extra is selected
  const isExtraSelected = (id: Extra['id']) => {
    return selectedExtras.find((selectedExtra) => selectedExtra.extra.id === id);
  };

  // Update extra quantity
  const updateExtraQuantity = (id: Extra['id'], newQuantity: number) => {
    if (newQuantity < 1) return;

    setSelectedExtras(
      selectedExtras.map((selectedExtra) =>
        selectedExtra.extra.id === id ? { ...selectedExtra, quantity: newQuantity } : selectedExtra
      )
    );
  };

  const extrasSubtotal = selectedExtras.reduce(
    (total, selectedExtra) => total + selectedExtra.extra.price * selectedExtra.quantity,
    0
  );

  const handleSubmitExtras = () => {
    if (selectedExtras.length === 0) return;
    onAddOnsChange?.(selectedExtras);
    toast.success('Extras successfully added!');
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-col bg-muted/50 py-4">
        <CardTitle className="flex w-full items-center justify-between">
          <div className="text-xl font-bold">Extras</div>
          <div>
            <Badge
              variant="secondary"
              className="bg-blue-100/50 capitalize text-blue-500 dark:bg-blue-900/50 dark:text-blue-300"
            >
              Add-ons
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex max-h-[75vh] flex-1 flex-col justify-between gap-4 overflow-y-auto px-6 py-4 text-xs">
        <div className="grid grid-cols-1 gap-3">
          {extras && extras.length > 0 ? (
            extras?.map((extra) => {
              const isSelected = isExtraSelected(extra.id);
              const selectedExtra = selectedExtras.find((item) => item.extra.id === extra.id);

              return (
                <div
                  key={extra.id}
                  className={cn(
                    'rounded-lg border p-3 text-xs transition-all',
                    isSelected ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/20'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{extra.name}</p>
                      <p className="text-xs text-muted-foreground">₱{extra.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleExtra(extra)}
                      className={cn(
                        'ml-2 whitespace-nowrap',
                        isSelected
                          ? 'bg-green-100/50 capitalize text-green-500 hover:bg-green-100/50 dark:bg-green-900/50 dark:text-green-300'
                          : ''
                      )}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </Button>
                  </div>

                  {isSelected && (
                    <div className="mt-3 flex items-center border-t pt-3">
                      <span className="mr-2 text-xs">Qty:</span>
                      <div className="flex items-center rounded-md border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() =>
                            updateExtraQuantity(extra.id, (selectedExtra?.quantity || 1) - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease</span>
                        </Button>
                        <span className="w-8 text-center">{selectedExtra?.quantity || 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() =>
                            updateExtraQuantity(extra.id, (selectedExtra?.quantity || 1) + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>
                      <div className="ml-auto">
                        <Badge variant="outline">
                          ₱{((selectedExtra?.quantity || 1) * extra.price).toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <Card className="col-span-3 border-none shadow-none md:border-solid">
              <CardHeader>
                <CardTitle className="text-center text-lg font-bold tracking-tight">
                  You have no items here.
                </CardTitle>
                <CardDescription className="text-center">
                  Add Products Extras in the Products Tab.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          {/* Selected extras summary */}
          {selectedExtras.length > 0 && (
            <>
              <div className="mt-4 rounded-lg bg-muted p-3 text-xs">
                <h4 className="mb-2 font-medium">Selected Extras</h4>
                <ul className="space-y-1">
                  {selectedExtras.map((selectedExtra) => (
                    <li key={selectedExtra.extra.id} className="flex justify-between">
                      <span className="mr-2 truncate">
                        {selectedExtra.quantity}x {selectedExtra.extra.name}
                      </span>
                      <span className="whitespace-nowrap">
                        ₱{(selectedExtra.extra.price * selectedExtra.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                  <span>Extras Subtotal:</span>
                  <span>₱{extrasSubtotal.toFixed(2)}</span>
                </div>
              </div>
              <Button onClick={handleSubmitExtras}>Add Extras</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
