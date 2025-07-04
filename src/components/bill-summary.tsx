'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter';

type BillSummaryProps = {
  billTotal: number;
  paidTotal: number;
  remainingTotal: number;
  language: string;
};

export function BillSummary({ billTotal, paidTotal, remainingTotal, language }: BillSummaryProps) {
  const progressPercentage = billTotal > 0 ? (paidTotal / billTotal) * 100 : 0;
  const formatCurrency = useCurrencyFormatter(language);

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
