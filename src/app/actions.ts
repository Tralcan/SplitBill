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
    if (!result || result.length === 0) {
      return { success: false, error: 'Could not detect any items. Please try a clearer picture.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error extracting receipt items:', error);
    return {
      success: false,
      error: 'Failed to process the receipt. Please try again with a clearer image.',
    };
  }
}
