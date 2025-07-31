'use server';

/**
 * @fileOverview A program description and title generator AI agent.
 *
 * - generateProgramDescriptions - A function that handles the generation of program descriptions and titles.
 * - GenerateProgramDescriptionsInput - The input type for the generateProgramDescriptions function.
 * - GenerateProgramDescriptionsOutput - The return type for the generateProgramDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProgramDescriptionsInputSchema = z.object({
  programDetails: z
    .string()
    .describe('Details about the program, including target audience, activities, and goals.'),
});
export type GenerateProgramDescriptionsInput = z.infer<typeof GenerateProgramDescriptionsInputSchema>;

const GenerateProgramDescriptionsOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title for the program.'),
  description: z.string().describe('A detailed and attractive description of the program.'),
});
export type GenerateProgramDescriptionsOutput = z.infer<typeof GenerateProgramDescriptionsOutputSchema>;

export async function generateProgramDescriptions(
  input: GenerateProgramDescriptionsInput
): Promise<GenerateProgramDescriptionsOutput> {
  return generateProgramDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProgramDescriptionsPrompt',
  input: {schema: GenerateProgramDescriptionsInputSchema},
  output: {schema: GenerateProgramDescriptionsOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating engaging content for educational programs.

You will use the following information to generate a title and description for the program.

Program Details: {{{programDetails}}}

Create a title that is both creative and informative, attracting potential participants. The description should be detailed, highlighting the benefits and activities of the program, while also being concise and easy to read.

Title:
Description: `,
});

const generateProgramDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateProgramDescriptionsFlow',
    inputSchema: GenerateProgramDescriptionsInputSchema,
    outputSchema: GenerateProgramDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

