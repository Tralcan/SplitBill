'use server';

import {
  extractItemsFromReceipt,
  type ExtractItemsFromReceiptOutput,
} from '@/ai/flows/extract-items-from-receipt';
import { z } from 'zod';

const actionInputSchema = z.object({
  photoDataUri: z.string(),
});

type ActionResponse = 
  | { success: true; data: ExtractItemsFromReceiptOutput }
  | { success: false; error: string };

export async function handleReceiptUpload(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const rawInput = {
    photoDataUri: formData.get('photoDataUri'),
  };

  const validatedInput = actionInputSchema.safeParse(rawInput);

  if (!validatedInput.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const result = await extractItemsFromReceipt(validatedInput.data);
    if (!result || !result.items || result.items.length === 0) {
      return { success: false, error: 'Could not detect any items. Please try a clearer picture.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error extracting receipt items:', error);
    
    // Provide a more helpful error message, especially for production environments like Vercel.
    const errorMessage = "Error al procesar el recibo. Esto puede deberse a que la API Key de Google no está configurada. Por favor, asegúrate de haberla añadido en los ajustes de 'Environment Variables' de tu proyecto en Vercel.";
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}
