'use client';

import { useState, useMemo, useEffect, useActionState, useRef } from 'react';
import type { Diner, Item } from '@/lib/types';
import { UploadReceipt } from '@/components/upload-receipt';
import { BillSummary } from '@/components/bill-summary';
import { DinerManager } from '@/components/diner-manager';
import { ItemList } from '@/components/item-list';
import { handleReceiptUpload } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardCopy } from 'lucide-react';
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter';

const playSuccessSound = () => {
  if (typeof window === 'undefined') return;
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (!audioContext) {
    console.warn("Web Audio API is not supported in this browser.");
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note for a pleasant ping
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

const initialState = {
  success: false,
  error: '',
  data: { items: [], language: 'es' },
};

export function SplitItRightApp() {
  const [items, setItems] = useState<Item[]>([]);
  const [diners, setDiners] = useState<Diner[]>([]);
  const [currentDinerId, setCurrentDinerId] = useState<string | null>(null);
  const [appState, setAppState] = useState<'idle' | 'splitting'>('idle');
  const [fontScaleIndex, setFontScaleIndex] = useState(2);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [receiptLanguage, setReceiptLanguage] = useState('es');
  const [discount, setDiscount] = useState(0);

  const { toast } = useToast();
  const [state, formAction] = useActionState(handleReceiptUpload, initialState);
  const prevRemainingTotal = useRef<number | null>(null);
  const formatCurrency = useCurrencyFormatter(receiptLanguage);

  useEffect(() => {
    const scales = [0.8, 0.9, 1.0, 1.15, 1.3];
    const baseFontSize = 16;
    document.documentElement.style.fontSize = `${baseFontSize * scales[fontScaleIndex]}px`;
    
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontScaleIndex]);
  
  const handleIncreaseFontSize = () => {
    setFontScaleIndex(prevIndex => Math.min(prevIndex + 1, 4));
  };

  const handleDecreaseFontSize = () => {
    setFontScaleIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  useEffect(() => {
    if (state.success && state.data) {
      const initialItems: Item[] = state.data.items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        name: item.item,
        dinerId: null,
      }));

      setItems(initialItems);
      setReceiptLanguage(state.data.language || 'es');
      setDiners([]);
      setCurrentDinerId(null);
      setAppState('splitting');
      toast({
        title: "¡Éxito!",
        description: "Tu recibo ha sido procesado. Ahora, añade a las personas que pagarán.",
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
    const discountMultiplier = 1 - (discount / 100);

    const dinerStats = diners.reduce((acc, diner) => {
      acc[diner.id] = { total: 0, calories: 0 };
      return acc;
    }, {} as Record<string, { total: number; calories: number }>);

    const itemsToSplit: Item[] = [];
    let assignedPriceTotal = 0;

    items.forEach(item => {
      if (item.dinerId && item.dinerId !== '__all__') {
        if (dinerStats[item.dinerId]) {
          assignedPriceTotal += item.price;
          dinerStats[item.dinerId].total += item.price;
          dinerStats[item.dinerId].calories += item.calories;
        }
      } else if (item.dinerId === '__all__') {
        assignedPriceTotal += item.price;
        itemsToSplit.push(item);
      }
    });

    if (diners.length > 0) {
      itemsToSplit.forEach(item => {
        const pricePerDiner = item.price / diners.length;
        const caloriesPerDiner = item.calories / diners.length;
        diners.forEach(diner => {
          if (dinerStats[diner.id]) {
            dinerStats[diner.id].total += pricePerDiner;
            dinerStats[diner.id].calories += caloriesPerDiner;
          }
        });
      });
    }

    Object.keys(dinerStats).forEach(dinerId => {
      dinerStats[dinerId].total *= discountMultiplier;
    });

    const discountedBillTotal = billTotal * discountMultiplier;
    
    // Total asignado es la suma de los totales de cada persona
    const totalAssignedInDinerStats = Object.values(dinerStats).reduce((sum, stats) => sum + stats.total, 0);

    return {
      billTotal,
      discountedTotal: discountedBillTotal,
      assignedTotal: totalAssignedInDinerStats,
      remainingTotal: discountedBillTotal - totalAssignedInDinerStats,
      dinerStats,
    };
  }, [items, diners, discount]);

  useEffect(() => {
    // Only play sound on the transition from not-fully-paid to fully-paid
    const isFullyAssigned = totals.discountedTotal > 0 && totals.remainingTotal <= 0.01;
    const wasPreviouslyNotFullyAssigned = prevRemainingTotal.current === null || prevRemainingTotal.current > 0.01;
    
    if (isFullyAssigned && wasPreviouslyNotFullyAssigned) {
      playSuccessSound();
    }
    
    // Store current remaining total for the next render
    prevRemainingTotal.current = totals.remainingTotal;
  }, [totals.remainingTotal, totals.discountedTotal]);

  const handleAddDiner = (name: string) => {
    const newDiner = { id: crypto.randomUUID(), name };
    setDiners([...diners, newDiner]);
    setCurrentDinerId(newDiner.id);
  };
  
  const handleRemoveDiner = (dinerId: string) => {
    setItems(items.map(item => item.dinerId === dinerId ? { ...item, dinerId: null } : item));
    const newDiners = diners.filter(d => d.id !== dinerId);
    setDiners(newDiners);
    
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
  
  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, price: newPrice } : item
      )
    );
  };

  const handleAddNewItem = () => {
    const price = parseFloat(newItemPrice);
    if (newItemName.trim() && !isNaN(price) && price >= 0) {
        const newItem: Item = {
            id: crypto.randomUUID(),
            name: newItemName.trim(),
            price: price,
            description: newItemDescription.trim(),
            dinerId: null,
            calories: 0,
        };
        setItems(prevItems => [...prevItems, newItem]);
        setIsAddItemDialogOpen(false);
        setNewItemName('');
        setNewItemPrice('');
        setNewItemDescription('');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleCopyToClipboard = async () => {
    const today = new Date().toLocaleDateString(receiptLanguage === 'es' ? 'es-ES' : 'en-US');
    
    const header = `Restaurant ${today}`;
    const totalLine = `Total: ${formatCurrency(totals.discountedTotal)}${discount > 0 ? ` (${formatCurrency(totals.billTotal)})` : ''}`;
    const discountLine = discount > 0 ? `_Descuento: ${discount}%_` : '';

    const textLines = [
        header,
        totalLine,
        discountLine,
    ];

    if (diners.length > 0) {
        const dinerLines = diners.map(diner => {
            const stats = totals.dinerStats[diner.id] || { total: 0 };
            return `${diner.name}: ${formatCurrency(stats.total)}`;
        });
        
        textLines.push('');
        textLines.push('*Total por Persona*');
        textLines.push(...dinerLines);
    }

    const textToCopy = textLines.filter(line => line !== '').join('\n');

    try {
        await navigator.clipboard.writeText(textToCopy);
        toast({
            title: '¡Copiado!',
            description: 'El resumen de la cuenta se ha copiado al portapapeles.',
        });
    } catch (error) {
        console.error('Error al copiar el texto:', error);
        toast({
            variant: 'destructive',
            title: 'Error al copiar',
            description: 'No se pudo copiar el resumen. Inténtalo de nuevo.',
        });
    }
  };

  const handleReset = () => {
    setItems([]);
    setDiners([]);
    setCurrentDinerId(null);
    setAppState('idle');
    setReceiptLanguage('es');
    setDiscount(0);
    prevRemainingTotal.current = null;
  }

  if (appState === 'idle') {
    return <UploadReceipt formAction={formAction} />;
  }

  const isNewItemFormValid = newItemName.trim() !== '' && newItemPrice.trim() !== '' && !isNaN(parseFloat(newItemPrice));

  return (
    <div className="space-y-6">
      <div className="space-y-6 bg-background rounded-lg p-2">
        <BillSummary
          billTotal={totals.billTotal}
          discountedTotal={totals.discountedTotal}
          assignedTotal={totals.assignedTotal}
          remainingTotal={totals.remainingTotal}
          language={receiptLanguage}
          discount={discount}
          onDiscountChange={setDiscount}
        />

        <DinerManager
          diners={diners}
          currentDinerId={currentDinerId}
          setCurrentDinerId={setCurrentDinerId}
          dinerStats={totals.dinerStats}
          onAddDiner={handleAddDiner}
          onRemoveDiner={handleRemoveDiner}
          onUpdateDinerName={handleUpdateDinerName}
          language={receiptLanguage}
          discount={discount}
        />
        
        <ItemList
          items={items}
          diners={diners}
          onAssignItem={handleAssignItem}
          onIncreaseFontSize={handleIncreaseFontSize}
          onDecreaseFontSize={handleDecreaseFontSize}
          onUpdateItemPrice={handleUpdateItemPrice}
          onAddItem={() => setIsAddItemDialogOpen(true)}
          onRemoveItem={handleRemoveItem}
          language={receiptLanguage}
        />
      </div>

      <div className="flex justify-end items-center pt-4 gap-2">
        <Button onClick={handleCopyToClipboard}>
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copiar Resumen
        </Button>
        <Button variant="outline" onClick={handleReset}>Empezar de nuevo</Button>
      </div>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir Artículo Manualmente</DialogTitle>
            <DialogDescription>
              Añade un artículo que no fue detectado en el escaneo. Haz clic en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="item-name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Hamburguesa"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-price" className="text-right">
                Precio
              </Label>
              <Input
                id="item-price"
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="col-span-3"
                placeholder="Ej: 12.50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-description" className="text-right">
                Descripción
              </Label>
              <Input
                id="item-description"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                className="col-span-3"
                placeholder="(Opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddNewItem} disabled={!isNewItemFormValid}>Guardar Artículo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
