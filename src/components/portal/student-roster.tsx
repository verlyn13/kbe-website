import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, User } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grade: number;
  enrolledPrograms: string[];
}

// Mock data - in production this would come from Firebase
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Smith',
    grade: 6,
    enrolledPrograms: ['MathCounts 2025'],
  },
  {
    id: '2',
    name: 'Emma Smith',
    grade: 4,
    enrolledPrograms: ['MathCounts 2025'],
  },
];

export function StudentRoster() {
  // For now, using mock data. In production, this would check actual registrations
  const students = mockStudents;
  const hasStudents = students.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Students</CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Add Student
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasStudents ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">No students registered yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your children to get started with program registration
            </p>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Your First Student
            </Button>
          </div>
        ) : (
          students.map((student) => (
          <div key={student.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">Grade {student.grade}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {student.enrolledPrograms.map((program) => (
                <Badge key={program} variant="secondary">
                  {program}
                </Badge>
              ))}
            </div>
          </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}