import { useCallback } from 'react';

export function useCurrencyFormatter(language: string) {
  const formatCurrency = useCallback((amount: number) => {
    if (language && language.toLowerCase().startsWith('en')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    } else {
      const roundedAmount = Math.round(amount);
      const formattedNumber = new Intl.NumberFormat('es-CL').format(roundedAmount);
      return `$ ${formattedNumber}`;
    }
  }, [language]);

  return formatCurrency;
}
