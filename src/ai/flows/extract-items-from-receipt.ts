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
  prompt: `You are an expert in analyzing restaurant receipts. The receipt can be in any language.

Analyze the receipt image and do the following:
1.  Identify the primary language of the text on the receipt. Return it as a two-letter ISO 639-1 code (e.g., 'en' for English, 'es' for Spanish).
2.  Extract all the items, their corresponding prices, and a short, one-sentence description for each item. Do not include tips or service charges unless they are explicitly listed as an item.
3.  **Handle Quantities**: If a line item on the receipt indicates a quantity (e.g., "2x", "3 x", "CANT: 2"), you must expand this into multiple, separate item entries in the output 'items' array. For example, if a line reads "2 x Cerveza" and the unit price is 2500, you should generate two distinct objects in the array: \`{ "item": "Cerveza", "price": 2500, "description": "..." }\` and \`{ "item": "Cerveza", "price": 2500, "description": "..." }\`. The price for each expanded item must be the price per single unit.
4.  **Crucially, handle prices according to the language:**
    *   **For non-English languages (like Spanish 'es'):** Prices often use '.' as a thousands separator and not for decimals. Treat the price as a whole number by removing all separators. For example, a price written as "12.345" should be interpreted and returned as the number \`12345\`. A price written as "2.500" should be \`2500\`.
    *   **For English ('en'):** Prices use '.' as a decimal separator. Interpret them as standard decimal numbers. For example, "$12.99" should be returned as the number \`12.99\`.

Return the data as a single JSON object with a 'language' field and an 'items' field containing an array of the extracted items, with prices formatted as numbers according to these rules.

Receipt Image: {{media url=photoDataUri}}
`,
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
