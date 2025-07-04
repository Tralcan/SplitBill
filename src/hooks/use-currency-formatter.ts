import { useCallback } from 'react';

export function useCurrencyFormatter(language: string) {
  const formatCurrency = useCallback((amount: number) => {
    if (language && language.toLowerCase().startsWith('en')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    } else {
      // For CLP (Chilean Peso), we expect whole numbers.
      // We round the amount to handle cases where division creates decimals.
      const formattedNumber = new Intl.NumberFormat('es-CL').format(Math.round(amount));
      return `$ ${formattedNumber}`;
    }
  }, [language]);

  return formatCurrency;
}
