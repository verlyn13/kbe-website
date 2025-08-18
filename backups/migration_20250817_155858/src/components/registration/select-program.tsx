'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const selectProgramSchema = z.object({
  programId: z.literal('mathcounts-2025'),
  commitment: z.boolean().refine((val) => val === true, {
    message: 'You must acknowledge the weekly commitment',
  }),
});

type SelectProgramFormData = z.infer<typeof selectProgramSchema>;

interface SelectProgramFormProps {
  onSubmit: (data: SelectProgramFormData) => void;
  onBack: () => void;
  studentNames: string[];
}

export function SelectProgramForm({ onSubmit, onBack, studentNames }: SelectProgramFormProps) {
  const form = useForm<SelectProgramFormData>({
    resolver: zodResolver(selectProgramSchema),
    defaultValues: {
      programId: 'mathcounts-2025',
      commitment: false,
    },
  });

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Select Program</CardTitle>
        <CardDescription>
          Review the program details and confirm your registration for {studentNames.join(', ')}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-lg border bg-muted/50 p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">MathCounts 2025 Season</h3>
                  <p className="text-muted-foreground mt-1">
                    National mathematics competition program for middle school students
                  </p>
                </div>
                <Badge variant="secondary">Registration Open</Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-medium">Meeting Schedule</p>
                    <p className="text-muted-foreground text-sm">
                      Tuesdays, 4:00-5:30pm<br />
                      September 2025 - March 2025
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground text-sm">
                      Homer Middle School<br />
                      Room 203
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-medium">Grade Levels</p>
                    <p className="text-muted-foreground text-sm">
                      4th - 8th Grade
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-medium">First Meeting</p>
                    <p className="text-muted-foreground text-sm">
                      Tuesday, September 9, 2025
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 rounded-md bg-background p-4">
                <h4 className="mb-2 font-medium">Important Competition Dates</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Chapter Competition: January 18, 2025</li>
                  <li>• State Competition: March 8, 2025</li>
                  <li>• National Competition: May 11-14, 2025 (for qualifiers)</li>
                </ul>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="commitment"
              render={({ field }) => (
                <FormItem className="rounded-lg border p-4">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I acknowledge the weekly commitment
                      </FormLabel>
                      <FormDescription>
                        I understand that consistent attendance is important for the team's success
                        and commit to attending weekly meetings on Tuesdays from 4:00-5:30pm.
                      </FormDescription>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Complete Registration
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}