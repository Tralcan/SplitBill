'use client';

import type { Diner, Item } from '@/lib/types';
import { ItemCard } from '@/components/item-card';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { List, ZoomIn, ZoomOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ItemListProps = {
  items: Item[];
  diners: Diner[];
  currentDinerId: string | null;
  onAssignItem: (itemId: string, dinerId: string | null) => void;
  onTogglePaid: (itemId: string) => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onUpdateItemPrice: (itemId: string, newPrice: number) => void;
  onAddItem: () => void;
  language: string;
};

export function ItemList({
  items,
  diners,
  currentDinerId,
  onAssignItem,
  onTogglePaid,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onUpdateItemPrice,
  onAddItem,
  language,
}: ItemListProps) {

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5"/>
            Artículos del Recibo
          </CardTitle>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDecreaseFontSize}>
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Achicar letra</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onIncreaseFontSize}>
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Agrandar letra</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-center text-muted-foreground">
            <p>No hay artículos en este recibo.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                diners={diners}
                currentDinerId={currentDinerId}
                onAssignItem={onAssignItem}
                onTogglePaid={onTogglePaid}
                onUpdateItemPrice={onUpdateItemPrice}
                language={language}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={onAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Añadir Artículo
        </Button>
      </CardFooter>
    </Card>
  );
}
