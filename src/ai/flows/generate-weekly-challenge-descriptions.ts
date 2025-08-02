'use server';

/**
 * @fileOverview AI tool to generate creative titles and descriptions for weekly challenges.
 *
 * - generateWeeklyChallengeDescriptions - A function that generates titles and descriptions for weekly challenges.
 * - GenerateWeeklyChallengeDescriptionsInput - The input type for the generateWeeklyChallengeDescriptions function.
 * - GenerateWeeklyChallengeDescriptionsOutput - The return type for the generateWeeklyChallengeDescriptions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateWeeklyChallengeDescriptionsInputSchema = z.object({
  topic: z.string().describe('The topic of the weekly challenge.'),
  gradeLevel: z.string().describe('The grade level for the weekly challenge.'),
});
export type GenerateWeeklyChallengeDescriptionsInput = z.infer<
  typeof GenerateWeeklyChallengeDescriptionsInputSchema
>;

const GenerateWeeklyChallengeDescriptionsOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title for the weekly challenge.'),
  description: z
    .string()
    .describe('A detailed and motivating description of the weekly challenge.'),
});
export type GenerateWeeklyChallengeDescriptionsOutput = z.infer<
  typeof GenerateWeeklyChallengeDescriptionsOutputSchema
>;

export async function generateWeeklyChallengeDescriptions(
  input: GenerateWeeklyChallengeDescriptionsInput
): Promise<GenerateWeeklyChallengeDescriptionsOutput> {
  return generateWeeklyChallengeDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyChallengeDescriptionsPrompt',
  input: { schema: GenerateWeeklyChallengeDescriptionsInputSchema },
  output: { schema: GenerateWeeklyChallengeDescriptionsOutputSchema },
  prompt: `You are an expert educator specializing in creating engaging weekly challenges for students.

You will use the topic and grade level provided to create a creative title and a detailed, motivating description for the challenge.

Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}

Please generate a title and description that will excite students and encourage them to participate.
`,
});

const generateWeeklyChallengeDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateWeeklyChallengeDescriptionsFlow',
    inputSchema: GenerateWeeklyChallengeDescriptionsInputSchema,
    outputSchema: GenerateWeeklyChallengeDescriptionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
