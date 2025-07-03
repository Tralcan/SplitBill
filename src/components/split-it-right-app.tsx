'use client';

import { useState, useMemo, useEffect, useActionState } from 'react';
import type { Diner, Item } from '@/lib/types';
import { UploadReceipt } from '@/components/upload-receipt';
import { BillSummary } from '@/components/bill-summary';
import { DinerManager } from '@/components/diner-manager';
import { ItemList } from '@/components/item-list';
import { handleReceiptUpload } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const initialState = {
  success: false,
  error: '',
  data: [],
};

export function SplitItRightApp() {
  const [items, setItems] = useState<Item[]>([]);
  const [diners, setDiners] = useState<Diner[]>([]);
  const [currentDinerId, setCurrentDinerId] = useState<string | null>(null);
  const [appState, setAppState] = useState<'idle' | 'splitting'>('idle');

  const { toast } = useToast();
  const [state, formAction] = useActionState(handleReceiptUpload, initialState);

  useEffect(() => {
    if (state.success && state.data) {
      const initialItems: Item[] = state.data.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        dinerId: null,
        isPaid: false,
      }));
      const initialDiner = { id: crypto.randomUUID(), name: 'Persona 1' };

      setItems(initialItems);
      setDiners([initialDiner]);
      setCurrentDinerId(initialDiner.id);
      setAppState('splitting');
      toast({
        title: "¡Éxito!",
        description: "Tu recibo ha sido procesado.",
      })
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: '¡Oh no! Algo salió mal.',
        description: state.error,
      });
    }
  }, [state, toast]);

  const totals = useMemo(() => {
    const billTotal = items.reduce((sum, item) => sum + item.price, 0);
    const paidTotal = items.filter((i) => i.isPaid).reduce((sum, item) => sum + item.price, 0);
    const remainingTotal = billTotal - paidTotal;
    const isSettled = remainingTotal <= 0 && billTotal > 0;

    const dinerTotals = diners.reduce((acc, diner) => {
      acc[diner.id] = items
        .filter((item) => item.dinerId === diner.id)
        .reduce((sum, item) => sum + item.price, 0);
      return acc;
    }, {} as Record<string, number>);

    return { billTotal, paidTotal, remainingTotal, isSettled, dinerTotals };
  }, [items, diners]);

  const handleAddDiner = () => {
    const newDiner = { id: crypto.randomUUID(), name: `Persona ${diners.length + 1}` };
    setDiners([...diners, newDiner]);
    setCurrentDinerId(newDiner.id);
  };
  
  const handleRemoveDiner = (dinerId: string) => {
    // Re-assign items of the removed diner to unassigned
    setItems(items.map(item => item.dinerId === dinerId ? { ...item, dinerId: null } : item));
    const newDiners = diners.filter(d => d.id !== dinerId);
    setDiners(newDiners);
    
    // If the removed diner was the current one, switch to the first available diner or null
    if (currentDinerId === dinerId) {
      setCurrentDinerId(newDiners.length > 0 ? newDiners[0].id : null);
    }
  };

  const handleUpdateDinerName = (dinerId: string, name: string) => {
    setDiners(diners.map(diner => diner.id === dinerId ? { ...diner, name } : diner));
  };

  const handleAssignItem = (itemId: string, dinerId: string | null) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, dinerId: dinerId } : item
      )
    );
  };

  const handleTogglePaid = (itemId: string) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, isPaid: !item.isPaid } : item))
    );
  };
  
  const handleReset = () => {
    setItems([]);
    setDiners([]);
    setCurrentDinerId(null);
    setAppState('idle');
  }

  if (appState === 'idle') {
    return <UploadReceipt formAction={formAction} />;
  }

  return (
    <div className="space-y-6">
      <BillSummary {...totals} />
      
      {totals.isSettled && (
        <div className="p-6 text-center bg-green-100 border-2 border-dashed rounded-lg border-primary dark:bg-green-900/50">
          <h2 className="text-2xl font-bold text-primary">¡Todo Pagado! 🎉</h2>
          <p className="mt-2 text-muted-foreground">Buen trabajo, la cuenta está completamente pagada.</p>
          <Button onClick={handleReset} className="mt-4">Comenzar Nueva Cuenta</Button>
        </div>
      )}

      <DinerManager
        diners={diners}
        currentDinerId={currentDinerId}
        setCurrentDinerId={setCurrentDinerId}
        dinerTotals={totals.dinerTotals}
        onAddDiner={handleAddDiner}
        onRemoveDiner={handleRemoveDiner}
        onUpdateDinerName={handleUpdateDinerName}
      />
      
      <ItemList
        items={items}
        diners={diners}
        currentDinerId={currentDinerId}
        onAssignItem={handleAssignItem}
        onTogglePaid={handleTogglePaid}
      />

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={handleReset}>Reiniciar y Empezar de Nuevo</Button>
      </div>
    </div>
  );
}
