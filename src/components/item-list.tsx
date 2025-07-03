'use client';

import type { Diner, Item } from '@/lib/types';
import { ItemCard } from '@/components/item-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

type ItemListProps = {
  items: Item[];
  diners: Diner[];
  currentDinerId: string | null;
  onAssignItem: (itemId: string, dinerId: string | null) => void;
  onTogglePaid: (itemId: string) => void;
};

export function ItemList({
  items,
  diners,
  currentDinerId,
  onAssignItem,
  onTogglePaid,
}: ItemListProps) {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">No hay artículos en este recibo.</p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-5 h-5"/>
          Artículos del Recibo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                diners={diners}
                currentDinerId={currentDinerId}
                onAssignItem={onAssignItem}
                onTogglePaid={onTogglePaid}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
