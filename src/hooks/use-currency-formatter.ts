import { useCallback } from 'react';

export function useCurrencyFormatter(language: string, billTotal: number) {
  const formatCurrency = useCallback((amount: number) => {
    // If the total is high, it's likely a currency without decimals (like CLP).
    // Otherwise, it might be one with decimals (like USD or EUR).
    const useDecimals = billTotal <= 1000;

    if (language && language.toLowerCase().startsWith('en')) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: useDecimals ? 2 : 0,
            maximumFractionDigits: useDecimals ? 2 : 0,
        }).format(useDecimals ? amount : Math.round(amount));
    } else {
      // For other languages like Spanish (CLP, etc.)
      const options: Intl.NumberFormatOptions = {
        // es-CL formatter for numbers without currency symbol.
        // We add the '$' manually for consistency.
        minimumFractionDigits: useDecimals ? 2 : 0,
        maximumFractionDigits: useDecimals ? 2 : 0,
      };
      
      const valueToFormat = useDecimals ? amount : Math.round(amount);
      const formattedNumber = new Intl.NumberFormat('es-CL', options).format(valueToFormat);
      
      return `$ ${formattedNumber}`;
    }
  }, [language, billTotal]);

  return formatCurrency;
}
