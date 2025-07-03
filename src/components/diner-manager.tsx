'use client';

import type { Diner } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, User, X, Pencil } from 'lucide-react';
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

type DinerManagerProps = {
  diners: Diner[];
  currentDinerId: string | null;
  setCurrentDinerId: (id: string) => void;
  dinerTotals: Record<string, number>;
  onAddDiner: () => void;
  onRemoveDiner: (id: string) => void;
  onUpdateDinerName: (id: string, name: string) => void;
};

export function DinerManager({
  diners,
  currentDinerId,
  setCurrentDinerId,
  dinerTotals,
  onAddDiner,
  onRemoveDiner,
  onUpdateDinerName,
}: DinerManagerProps) {
  const [editingDiner, setEditingDiner] = React.useState<Diner | null>(null);
  const [newName, setNewName] = React.useState('');

  const handleSaveName = () => {
    if (editingDiner && newName.trim()) {
      onUpdateDinerName(editingDiner.id, newName.trim());
    }
    setEditingDiner(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <User className="w-5 h-5" />
        ¿Quién Paga?
      </h2>
      <div className="flex items-center gap-2">
        <Tabs value={currentDinerId ?? ''} onValueChange={setCurrentDinerId} className="w-full">
          <TabsList className="h-auto p-1 flex-wrap">
            {diners.map((diner) => (
              <div key={diner.id} className="relative group">
                <TabsTrigger value={diner.id} className="flex-col h-auto p-2 data-[state=active]:shadow-md">
                   <span className="font-semibold">{diner.name}</span>
                   <span className="text-xs text-muted-foreground font-normal group-data-[state=active]:text-primary">{formatCurrency(dinerTotals[diner.id] ?? 0)}</span>
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

                  {diners.length > 1 && (
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
                  )}
                </div>
              </div>
            ))}
             <Button variant="outline" size="sm" onClick={onAddDiner} className="ml-2">
                <Plus className="mr-2 h-4 w-4" />
                Añadir Persona
              </Button>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
