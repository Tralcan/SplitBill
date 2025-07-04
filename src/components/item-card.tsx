'use client';

import { useState, useRef, useEffect } from 'react';
import type { Diner, Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Hand, Undo2, Pencil, Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

type ItemCardProps = {
  item: Item;
  diners: Diner[];
  currentDinerId: string | null;
  onAssignItem: (itemId: string, dinerId: string | null) => void;
  onTogglePaid: (itemId: string) => void;
  onUpdateItemPrice: (itemId: string, newPrice: number) => void;
  onRemoveItem: (itemId: string) => void;
  language: string;
};

export function ItemCard({
  item,
  diners,
  currentDinerId,
  onAssignItem,
  onTogglePaid,
  onUpdateItemPrice,
  onRemoveItem,
  language,
}: ItemCardProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceStr, setPriceStr] = useState(item.price.toFixed(2));
  const inputRef = useRef<HTMLInputElement>(null);
  const formatCurrency = useCurrencyFormatter(language);

  const assignedDiner = item.dinerId ? diners.find((d) => d.id === item.dinerId) : null;
  
  const isClaimed = !!item.dinerId;
  const isClaimedByCurrentUser = item.dinerId === currentDinerId;

  const handleSavePrice = () => {
    const newPrice = parseFloat(priceStr);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onUpdateItemPrice(item.id, newPrice);
    } else {
      setPriceStr(item.price.toFixed(2));
    }
    setIsEditingPrice(false);
  };

  const handlePriceClick = () => {
    if (!item.isPaid) {
      setPriceStr(item.price.toFixed(2));
      setIsEditingPrice(true);
    }
  };

  useEffect(() => {
    if (isEditingPrice && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditingPrice]);

  useEffect(() => {
    if (!isEditingPrice) {
      setPriceStr(item.price.toFixed(2));
    }
  }, [item.price, isEditingPrice]);

  return (
    <div
      className={cn(
        'p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300',
        item.isPaid ? 'bg-muted/50 opacity-60' : 'bg-card',
        isClaimedByCurrentUser && !item.isPaid ? 'border-primary shadow-sm' : ''
      )}
    >
      <div className="flex-grow space-y-1 w-full">
        <p className={cn('font-medium', item.isPaid && 'line-through')}>
          {item.name}
        </p>
        <p className={cn('text-sm text-muted-foreground', item.isPaid && 'line-through')}>
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
                       setPriceStr(item.price.toFixed(2));
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
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !item.isPaid) handlePriceClick() }}
                    role="button"
                    tabIndex={item.isPaid ? -1 : 0}
                    aria-label="Editar precio"
                    className={cn(
                        'flex items-center gap-1.5 p-1 -m-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        !item.isPaid ? 'cursor-pointer hover:bg-accent' : 'cursor-default'
                    )}
                >
                    <span className={cn('text-sm font-semibold text-primary', item.isPaid && 'line-through text-muted-foreground')}>
                        {formatCurrency(item.price)}
                    </span>
                    {!item.isPaid && <Pencil className="h-3 w-3 text-muted-foreground" />}
                </div>
            )}

            {assignedDiner && (
                <Badge variant={isClaimedByCurrentUser ? "default" : "secondary"}>
                    {assignedDiner.name}
                </Badge>
            )}
        </div>
      </div>

      <div className="flex items-center gap-4 self-end sm:self-center">
        {!isClaimed && currentDinerId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignItem(item.id, currentDinerId)}
              disabled={item.isPaid}
            >
              <Hand className="mr-2 h-4 w-4" />
              Reclamar
            </Button>
        )}
        {isClaimed && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAssignItem(item.id, null)}
              disabled={item.isPaid}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              Soltar
            </Button>
        )}

        <div className="flex items-center space-x-2 border-l pl-4">
          <Switch
            id={`paid-switch-${item.id}`}
            checked={item.isPaid}
            onCheckedChange={() => onTogglePaid(item.id)}
            aria-label="Marcar como pagado"
            disabled={!isClaimed}
          />
          <Label htmlFor={`paid-switch-${item.id}`} className={cn('text-sm', item.isPaid && 'text-muted-foreground', !isClaimed && 'text-muted-foreground/50')}>Pagado</Label>
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" disabled={item.isPaid}>
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
