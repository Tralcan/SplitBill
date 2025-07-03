'use client';

import type { Diner, Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Hand, Undo2 } from 'lucide-react';

type ItemCardProps = {
  item: Item;
  diners: Diner[];
  currentDinerId: string | null;
  onAssignItem: (itemId: string, dinerId: string | null) => void;
  onTogglePaid: (itemId: string) => void;
};

export function ItemCard({
  item,
  diners,
  currentDinerId,
  onAssignItem,
  onTogglePaid,
}: ItemCardProps) {
  const assignedDiner = item.dinerId ? diners.find((d) => d.id === item.dinerId) : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const canBeClaimed = !item.dinerId;
  const isClaimedByCurrentUser = item.dinerId === currentDinerId;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border flex items-center justify-between gap-4 transition-all duration-300',
        item.isPaid ? 'bg-muted/50 opacity-60' : 'bg-card',
        isClaimedByCurrentUser && !item.isPaid ? 'border-primary shadow-sm' : ''
      )}
    >
      <div className="flex-grow space-y-1">
        <p className={cn('font-medium', item.isPaid && 'line-through')}>
          {item.name}
        </p>
        <div className="flex items-center gap-2">
            <span className={cn('text-sm font-semibold text-primary', item.isPaid && 'line-through')}>
                {formatCurrency(item.price)}
            </span>
            {assignedDiner && (
                <Badge variant={isClaimedByCurrentUser ? "default" : "secondary"}>
                    {assignedDiner.name}
                </Badge>
            )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {canBeClaimed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignItem(item.id, currentDinerId)}
              disabled={!currentDinerId || item.isPaid}
            >
              <Hand className="mr-2 h-4 w-4" />
              Claim
            </Button>
        )}
        {isClaimedByCurrentUser && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAssignItem(item.id, null)}
              disabled={item.isPaid}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              Release
            </Button>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id={`paid-switch-${item.id}`}
            checked={item.isPaid}
            onCheckedChange={() => onTogglePaid(item.id)}
            aria-label="Mark as paid"
          />
          <Label htmlFor={`paid-switch-${item.id}`} className={cn('text-sm', item.isPaid && 'text-muted-foreground')}>Paid</Label>
        </div>
      </div>
    </div>
  );
}
