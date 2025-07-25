'use client';

import type { Diner } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, User, X, Pencil, Flame } from 'lucide-react';
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
import React from 'react';
import { Input } from './ui/input';
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter';

type DinerManagerProps = {
  diners: Diner[];
  currentDinerId: string | null;
  setCurrentDinerId: (id: string | null) => void;
  dinerStats: Record<string, { total: number; calories: number }>;
  onAddDiner: (name: string) => void;
  onRemoveDiner: (id: string) => void;
  onUpdateDinerName: (id: string, name: string) => void;
  language: string;
  discount: number;
  billTotal: number;
};

export function DinerManager({
  diners,
  currentDinerId,
  setCurrentDinerId,
  dinerStats,
  onAddDiner,
  onRemoveDiner,
  onUpdateDinerName,
  language,
  discount,
  billTotal,
}: DinerManagerProps) {
  const [editingDiner, setEditingDiner] = React.useState<Diner | null>(null);
  const [newName, setNewName] = React.useState('');
  const [isAddingDiner, setIsAddingDiner] = React.useState(false);
  const [newDinerName, setNewDinerName] = React.useState('');
  const formatCurrency = useCurrencyFormatter(language, billTotal);

  const handleSaveName = () => {
    if (editingDiner && newName.trim()) {
      onUpdateDinerName(editingDiner.id, newName.trim());
    }
    setEditingDiner(null);
  };
  
  const handleConfirmAddDiner = () => {
    let finalName = newDinerName.trim();
    if (!finalName) {
      const personaNumbers = diners
        .map(d => {
            const match = d.name.match(/^Persona (\d+)$/);
            return match ? parseInt(match[1], 10) : 0;
        });
      
      const highestNumber = personaNumbers.length > 0 ? Math.max(0, ...personaNumbers) : 0;
      finalName = `Persona ${highestNumber + 1}`;
    }
    
    onAddDiner(finalName);
    setNewDinerName('');
    setIsAddingDiner(false);
  };

  return (
    <div className="pb-4">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <User className="w-5 h-5" />
        ¿Quién Paga?
      </h2>
      <div className="flex flex-col gap-2">
        <div className="w-full overflow-x-auto">
            <Tabs value={currentDinerId ?? ''} onValueChange={setCurrentDinerId} className="w-full">
              <TabsList className="h-auto p-1 flex-wrap sm:flex-nowrap">
                {diners.map((diner) => (
                  <div key={diner.id} className="relative group p-0.5">
                    <TabsTrigger value={diner.id} className="group/tab flex-col h-auto p-2 gap-1 text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-transform">
                      <span className="font-semibold">{diner.name}</span>
                      <span className="font-bold text-base">{formatCurrency(dinerStats[diner.id]?.total ?? 0)}</span>
                      {(dinerStats[diner.id]?.calories ?? 0) > 0 && (
                        <span className="text-xs flex items-center gap-1 text-muted-foreground group-data-[state=active]/tab:text-primary-foreground">
                          <Flame className="w-3 h-3"/>
                          {Math.round(dinerStats[diner.id].calories)} Cal
                        </span>
                      )}
                    </TabsTrigger>
                    
                    <div className="absolute top-0 right-0.5 flex items-center -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <AlertDialog open={editingDiner?.id === diner.id} onOpenChange={(open) => !open && setEditingDiner(null)}>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" onClick={() => { setEditingDiner(diner); setNewName(diner.name); }}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onEscapeKeyDown={() => setEditingDiner(null)}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Editar Nombre</AlertDialogTitle>
                            <AlertDialogDescription>
                              Elige un nuevo nombre para {diner.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveName(); } }}
                            autoFocus
                          />
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSaveName}>Guardar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-destructive/80 hover:text-destructive-foreground">
                            <X className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esto eliminará a {diner.name} y desasignará todos sus artículos. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onRemoveDiner(diner.id)}>
                              Eliminar Persona
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
                <AlertDialog open={isAddingDiner} onOpenChange={(isOpen) => { setIsAddingDiner(isOpen); if (!isOpen) setNewDinerName(''); }}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2 flex-shrink-0">
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir Persona
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Añadir Nueva Persona</AlertDialogTitle>
                      <AlertDialogDescription>
                        Introduce el nombre de la persona que va a pagar. Si no introduces un nombre, se asignará uno automáticamente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                      value={newDinerName}
                      onChange={(e) => setNewDinerName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirmAddDiner(); } }}
                      placeholder="Ej: Juan Pérez (Opcional)"
                      autoFocus
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleConfirmAddDiner}>Añadir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TabsList>
            </Tabs>
        </div>
        {discount > 0 && (
            <p className="text-sm italic text-muted-foreground mt-2 text-left">
                El descuento será aplicado a cada persona
            </p>
        )}
      </div>
    </div>
  );
}
