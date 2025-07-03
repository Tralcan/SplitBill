'use client';

import type { Diner } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, User, X } from 'lucide-react';
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

type DinerManagerProps = {
  diners: Diner[];
  currentDinerId: string | null;
  setCurrentDinerId: (id: string) => void;
  dinerTotals: Record<string, number>;
  onAddDiner: () => void;
  onRemoveDiner: (id: string) => void;
};

export function DinerManager({
  diners,
  currentDinerId,
  setCurrentDinerId,
  dinerTotals,
  onAddDiner,
  onRemoveDiner,
}: DinerManagerProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <User className="w-5 h-5" />
        Who's Paying?
      </h2>
      <div className="flex items-center gap-2">
        <Tabs value={currentDinerId ?? ''} onValueChange={setCurrentDinerId} className="w-full">
          <TabsList className="h-auto p-1 flex-wrap">
            {diners.map((diner) => (
              <div key={diner.id} className="relative group pr-2">
                <TabsTrigger value={diner.id} className="flex-col h-auto p-2 data-[state=active]:shadow-md">
                   <span className="font-semibold">{diner.name}</span>
                   <span className="text-xs text-muted-foreground font-normal group-data-[state=active]:text-primary">{formatCurrency(dinerTotals[diner.id] ?? 0)}</span>
                </TabsTrigger>
                {diners.length > 1 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute -top-2 -right-1 h-5 w-5 rounded-full bg-muted-foreground/20 hover:bg-destructive/80 hover:text-destructive-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove {diner.name} and unassign all their items. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onRemoveDiner(diner.id)}>
                        Remove Diner
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                )}
              </div>
            ))}
             <Button variant="outline" size="sm" onClick={onAddDiner} className="ml-2">
                <Plus className="mr-2 h-4 w-4" />
                Add Diner
              </Button>
          </TabsList>
        </Tabs>
       
      </div>
    </div>
  );
}
