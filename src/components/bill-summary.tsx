'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type BillSummaryProps = {
  billTotal: number;
  discountedTotal: number;
  assignedTotal: number;
  remainingTotal: number;
  language: string;
  discount: number;
  onDiscountChange: (value: number) => void;
};

export function BillSummary({ billTotal, discountedTotal, assignedTotal, remainingTotal, language, discount, onDiscountChange }: BillSummaryProps) {
  const progressPercentage = discountedTotal > 0 ? (assignedTotal / discountedTotal) * 100 : 0;
  const formatCurrency = useCurrencyFormatter(language);

  const handleDiscountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
        value = 0;
    }
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    onDiscountChange(value);
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
            <span>Asignado: {formatCurrency(assignedTotal)}</span>
            <span>Por Asignar: {formatCurrency(remainingTotal)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-1">
                <Label htmlFor="discount-input" className="text-base">¿Tienes un descuento?</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="discount-input"
                        type="number"
                        value={discount === 0 ? '' : discount}
                        onChange={handleDiscountInputChange}
                        placeholder="0"
                        className="w-20 h-9"
                        min="0"
                        max="100"
                    />
                    <span className="text-muted-foreground">%</span>
                </div>
            </div>
            <div className="text-right">
                {discount > 0 && (
                    <div className="text-sm text-muted-foreground line-through">
                        {formatCurrency(billTotal)}
                    </div>
                )}
                <div className="text-2xl font-bold">
                    Total: <span className="text-primary">{formatCurrency(discountedTotal)}</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
