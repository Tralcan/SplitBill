'use server';
/**
 * @fileOverview An AI agent that extracts items and prices from a receipt image.
 *
 * - extractItemsFromReceipt - A function that handles the receipt item extraction process.
 * - ExtractItemsFromReceiptInput - The input type for the extractItemsFromReceipt function.
 * - ExtractItemsFromReceiptOutput - The return type for the extractItemsFromReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractItemsFromReceiptInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractItemsFromReceiptInput = z.infer<typeof ExtractItemsFromReceiptInputSchema>;

const ExtractItemsFromReceiptOutputSchema = z.object({
  items: z.array(
    z.object({
      item: z.string().describe('The name of the item.'),
      price: z.number().describe('The price of the item.'),
      description: z.string().describe('A brief, one-sentence description of the item.'),
    })
  ),
  language: z.string().describe("The primary language of the receipt as a two-letter ISO 639-1 code (e.g., 'en' for English, 'es' for Spanish)."),
});
export type ExtractItemsFromReceiptOutput = z.infer<typeof ExtractItemsFromReceiptOutputSchema>;

export async function extractItemsFromReceipt(input: ExtractItemsFromReceiptInput): Promise<ExtractItemsFromReceiptOutput> {
  return extractItemsFromReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractItemsFromReceiptPrompt',
  input: {schema: ExtractItemsFromReceiptInputSchema},
  output: {schema: ExtractItemsFromReceiptOutputSchema},
  prompt: `You are an expert in analyzing restaurant receipts. The receipt can be in any language.\n\nAnalyze the receipt image and do the following:\n1. Identify the primary language of the text on the receipt. Return it as a two-letter ISO 639-1 code (e.g., 'en' for English, 'es' for Spanish).\n2. Extract all the items, their corresponding prices, and a short, one-sentence description for each item.\n\nReturn the data as a single JSON object with a 'language' field and an 'items' field containing an array of the extracted items.\n\nReceipt Image: {{media url=photoDataUri}}\n`,
});

const extractItemsFromReceiptFlow = ai.defineFlow(
  {
    name: 'extractItemsFromReceiptFlow',
    inputSchema: ExtractItemsFromReceiptInputSchema,
    outputSchema: ExtractItemsFromReceiptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
