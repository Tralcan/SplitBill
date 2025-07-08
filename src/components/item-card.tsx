'use client';

import { useState, useRef, useEffect } from 'react';
import type { Diner, Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ItemCardProps = {
  item: Item;
  diners: Diner[];
  onAssignItem: (itemId: string, dinerId: string | null) => void;
  onUpdateItemPrice: (itemId: string, newPrice: number) => void;
  onRemoveItem: (itemId: string) => void;
  language: string;
  billTotal: number;
};

export function ItemCard({
  item,
  diners,
  onAssignItem,
  onUpdateItemPrice,
  onRemoveItem,
  language,
  billTotal,
}: ItemCardProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceStr, setPriceStr] = useState(String(item.price));
  const inputRef = useRef<HTMLInputElement>(null);
  const formatCurrency = useCurrencyFormatter(language, billTotal);
  
  const handleSavePrice = () => {
    const newPrice = parseFloat(priceStr);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onUpdateItemPrice(item.id, newPrice);
    } else {
      setPriceStr(String(item.price));
    }
    setIsEditingPrice(false);
  };

  const handlePriceClick = () => {
    setPriceStr(String(item.price));
    setIsEditingPrice(true);
  };

  useEffect(() => {
    if (isEditingPrice && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditingPrice]);

  useEffect(() => {
    if (!isEditingPrice) {
      setPriceStr(String(item.price));
    }
  }, [item.price, isEditingPrice]);

  return (
    <div
      className={cn(
        'p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 bg-card'
      )}
    >
      <div className="flex-grow space-y-1 w-full">
        <p className='font-medium'>
          {item.name}
        </p>
        <p className='text-sm text-muted-foreground'>
          {item.description}
        </p>
        <div className="flex items-center gap-2 pt-1">
            {isEditingPrice ? (
               <div className="flex items-center gap-1">
                 <span className="text-sm font-semibold text-primary mr-1">$</span>
                 <Input
                   ref={inputRef}
                   type="number"
                   value={priceStr}
                   onChange={(e) => setPriceStr(e.target.value)}
                   onBlur={handleSavePrice}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') handleSavePrice();
                     if (e.key === 'Escape') {
                       setIsEditingPrice(false);
                       setPriceStr(String(item.price));
                     }
                   }}
                   className="h-8 w-24 px-2 text-sm"
                   step="0.01"
                   min="0"
                 />
               </div>
            ) : (
                <div
                    onClick={handlePriceClick}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePriceClick() }}
                    role="button"
                    tabIndex={0}
                    aria-label="Editar precio"
                    className={cn(
                        'flex items-center gap-1.5 p-1 -m-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer hover:bg-accent'
                    )}
                >
                    <span className='text-sm font-semibold text-primary'>
                        {formatCurrency(item.price)}
                    </span>
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                </div>
            )}
        </div>
      </div>

      <div className="flex items-center gap-4 self-end sm:self-center">
        <Select
          value={item.dinerId ?? 'null'}
          onValueChange={(value) => onAssignItem(item.id, value === 'null' ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Asignar a..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">Sin asignar</SelectItem>
            {diners.length > 0 && <SelectItem value="__all__">Todos (dividir)</SelectItem>}
            {diners.map((diner) => (
              <SelectItem key={diner.id} value={diner.id}>
                {diner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center border-l pl-4">
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar artículo</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar este artículo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esto eliminará permanentemente "{item.name}" de la lista. Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
    </div>
  );
}
