import { useCallback } from 'react';

export function useCurrencyFormatter(language: string) {
  const formatCurrency = useCallback((amount: number) => {
    if (language && language.toLowerCase().startsWith('en')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    } else {
      // For CLP (Chilean Peso), we expect whole numbers from the AI.
      // We format it according to Chilean standards.
      const formattedNumber = new Intl.NumberFormat('es-CL').format(amount);
      return `$ ${formattedNumber}`;
    }
  }, [language]);

  return formatCurrency;
}
