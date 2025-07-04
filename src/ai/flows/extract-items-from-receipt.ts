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
      calories: z.number().describe('An estimated calorie count for the item. This is for fun, so a reasonable approximation is fine.'),
      description: z.string().describe('An evocative, celebratory one-sentence comment about the item.'),
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
  prompt: `You are an expert in analyzing restaurant receipts with a witty, celebratory, and highly imaginative personality. Your main goal is to capture the unique joy of a shared meal.

Analyze the receipt image and perform the following tasks:
1.  Identify the primary language of the text on the receipt. Return it as a two-letter ISO 639-1 code (e.g., 'en' for English, 'es' for Spanish).
2.  For the 'description' field of each item, your creativity is key. Generate a fun, evocative, and celebratory one-sentence comment about consuming that item, in the language of the receipt.
    *   **NO REPITAS EL NOMBRE DEL ARTÍCULO**: La descripción complementa el nombre, no lo repite. El usuario ya ve el nombre del artículo, por lo que la descripción debe ser un comentario original sobre él que no incluya el nombre del artículo.
    *   **BE CREATIVE AND AVOID REPETITION**: Do not overuse phrases like "Salud por..." or "Un brindis por...". Instead, comment on the potential taste, the experience, or a fun memory associated with the item.
    *   **HANDLE ABBREVIATIONS/UNKNOWN ITEMS**: If you encounter an item that is abbreviated or you don't recognize (e.g., "Beb. Var.", "Misc."), create a general but positive comment about enjoying the meal, like "¡El acompañamiento perfecto para una buena charla!" or "Un detalle para hacer la comida aún mejor.".
    *   **GIVE UNIQUE DESCRIPTIONS**: If an item is duplicated (e.g., from a line like '2x Cerveza'), you **must write a completely unique and different description for each instance**.
    *   **Example of good descriptions**: For the item "Lomo Saltado", you could write "Ese juguito es para no dejar ni una gota, ¡qué delicia!". For the item "Cheesecake", something like "Un final cremoso y dulce para una comida memorable.". Notice how the item name is not repeated in the description.
3.  **Handle Quantities and Price Division**: If a line item on the receipt indicates a quantity greater than one (e.g., "2x Cerveza 9.800"), you must do two things:
    a.  **Expand the Item**: Create a separate item entry in the output 'items' array for each unit. For "2x Cerveza", you will create two entries.
    b.  **Divide the Price**: The price shown on that line is the *total price* for all units. You must divide this total price by the quantity to get the correct price for each individual, expanded item. For example, if the line is "2 x Cerveza 9.800", you must first parse the number (e.g., to 9800), then calculate the unit price as 9800 / 2 = 4900. The output should then be two distinct objects: \`{ "item": "Cerveza", "price": 4900, "description": "..." }\` and \`{ "item": "Cerveza", "price": 4900, "description": "..." }\`. The price for each expanded item *must be the price per single unit*.
4.  **Estimate Calories**: For each item, provide a rough estimate of its calorie content in the 'calories' field. This is for fun and informational purposes, so a reasonable approximation is sufficient (e.g., a beer is around 150-200 calories, a slice of cheesecake around 400). If you cannot determine the calories for an item, return 0.
5.  **Crucially, handle prices according to the language:**
    *   **For non-English languages (like Spanish 'es'):** Prices often use '.' as a thousands separator and not for decimals. Treat the price as a whole number by removing all separators *before* performing any division. For example, a price written as "12.345" should be interpreted as the number \`12345\`. A price written as "2.500" should be \`2500\`.
    *   **For English ('en'):** Prices use '.' as a decimal separator. Interpret them as standard decimal numbers. For example, "$12.99" should be returned as the number \`12.99\`.
6. Do not include tips or service charges unless they are explicitly listed as an item.

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
