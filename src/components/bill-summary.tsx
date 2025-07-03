'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type BillSummaryProps = {
  billTotal: number;
  paidTotal: number;
  remainingTotal: number;
};

export function BillSummary({ billTotal, paidTotal, remainingTotal }: BillSummaryProps) {
  const progressPercentage = billTotal > 0 ? (paidTotal / billTotal) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de la Cuenta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Pagado: {formatCurrency(paidTotal)}</span>
            <span>Restante: {formatCurrency(remainingTotal)}</span>
          </div>
        </div>
        <div className="text-right text-2xl font-bold">
          Total: <span className="text-primary">{formatCurrency(billTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
