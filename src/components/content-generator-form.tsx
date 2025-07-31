"use client";

import { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  generateProgramDescriptions,
  GenerateProgramDescriptionsOutput,
} from "@/ai/flows/generate-program-descriptions";
import {
  generateWeeklyChallengeDescriptions,
  GenerateWeeklyChallengeDescriptionsOutput,
} from "@/ai/flows/generate-weekly-challenge-descriptions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { logger } from "@/lib/logger";

const programSchema = z.object({
  programDetails: z.string().min(10, {
    message: "Program details must be at least 10 characters.",
  }),
});

const challengeSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }),
  gradeLevel: z.string().min(1, {
    message: "Please select a grade level.",
  }),
});

type ContentGeneratorFormProps = {
  type: "program" | "challenge";
};

type AIResult = GenerateProgramDescriptionsOutput | GenerateWeeklyChallengeDescriptionsOutput;

/**
 * Content generator form component for creating AI-generated content.
 * Supports generating program descriptions and weekly challenges.
 * 
 * @component
 * @param {ContentGeneratorFormProps} props - Component props
 * @param {'program' | 'challenge'} props.type - Type of content to generate
 * @example
 * <ContentGeneratorForm type="program" />
 */
export function ContentGeneratorForm({ type }: ContentGeneratorFormProps) {
  const [result, setResult] = useState<AIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formSchema = type === "program" ? programSchema : challengeSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: type === "program" ? { programDetails: "" } : { topic: "", gradeLevel: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      let response;
      if (type === "program") {
        response = await generateProgramDescriptions(values as z.infer<typeof programSchema>);
      } else {
        response = await generateWeeklyChallengeDescriptions(values as z.infer<typeof challengeSchema>);
      }
      setResult(response);
    } catch (error) {
        logger.error("Error generating content", error);
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Failed to generate content. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {type === "program" ? (
            <FormField
              control={form.control}
              name="programDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A summer camp for middle schoolers focusing on marine biology, with hands-on activities like kayaking and tide pooling."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about the program, including target audience, activities, and goals.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ocean Currents" {...field} />
                    </FormControl>
                     <FormDescription>
                        Enter a topic for the weekly challenge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a grade level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="K-2">K-2</SelectItem>
                          <SelectItem value="3-5">3-5</SelectItem>
                          <SelectItem value="6-8">6-8 (Middle School)</SelectItem>
                          <SelectItem value="9-12">9-12 (High School)</SelectItem>
                        </SelectContent>
                      </Select>
                       <FormDescription>
                        Target grade level for the challenge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Content
          </Button>
        </form>
      </Form>

      {isLoading && (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Generating...</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles /> Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Title</h3>
              <p className="text-muted-foreground">{result.title}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{result.description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
