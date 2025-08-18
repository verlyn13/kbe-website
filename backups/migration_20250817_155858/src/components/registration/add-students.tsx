'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const studentSchema = z.object({
  firstName: z.string().min(2, 'Please enter first name'),
  lastName: z.string().min(2, 'Please enter last name'),
  grade: z.string().refine((val) => {
    const grade = parseInt(val);
    return grade >= 4 && grade <= 8;
  }, 'MathCounts is for grades 4-8'),
  school: z.string().min(1, 'Please select a school'),
  allergies: z.string().optional(),
});

const addStudentsSchema = z.object({
  students: z.array(studentSchema).min(1, 'Please add at least one student'),
});

type AddStudentsFormData = z.infer<typeof addStudentsSchema>;

interface AddStudentsFormProps {
  onSubmit: (data: AddStudentsFormData) => void;
  onBack: () => void;
}

const HOMER_SCHOOLS = [
  'Homer Middle School',
  'Homer High School',
  'West Homer Elementary',
  'Paul Banks Elementary',
  'McNeil Canyon Elementary',
  'Homeschool',
  'Other',
];

export function AddStudentsForm({ onSubmit, onBack }: AddStudentsFormProps) {
  const form = useForm<AddStudentsFormData>({
    resolver: zodResolver(addStudentsSchema),
    defaultValues: {
      students: [
        {
          firstName: '',
          lastName: '',
          grade: '',
          school: '',
          allergies: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'students',
  });

  const addStudent = () => {
    append({
      firstName: '',
      lastName: '',
      grade: '',
      school: '',
      allergies: '',
    });
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Add Students</CardTitle>
        <CardDescription>
          Add the students you'd like to register for MathCounts. You can add multiple students.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Student {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`students.${index}.firstName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`students.${index}.lastName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`students.${index}.grade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="4">4th Grade</SelectItem>
                              <SelectItem value="5">5th Grade</SelectItem>
                              <SelectItem value="6">6th Grade</SelectItem>
                              <SelectItem value="7">7th Grade</SelectItem>
                              <SelectItem value="8">8th Grade</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            MathCounts is for students in grades 4-8
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`students.${index}.school`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select school" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {HOMER_SCHOOLS.map((school) => (
                                <SelectItem key={school} value={school}>
                                  {school}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`students.${index}.allergies`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please list any allergies, medical conditions, or special needs we should be aware of"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This information is kept confidential and only shared with program leaders
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addStudent}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Student
            </Button>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue to Program Selection
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}