'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { registrationService, Registration } from '@/lib/firebase-admin';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Users, 
  UserCheck,
  Clock,
  AlertCircle,
  Calendar,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RegistrationStats {
  total: number;
  pending: number;
  active: number;
  waitlist: number;
  byGrade: Record<string, number>;
  bySchool: Record<string, number>;
}

export default function AdminReportsPage() {
  const { hasPermission } = useAdmin();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState('mathcounts-2025');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);

  useEffect(() => {
    if (hasPermission('view_reports')) {
      loadRegistrationData();
    }
  }, [selectedProgram, hasPermission]);

  async function loadRegistrationData() {
    try {
      setLoading(true);
      const [regs, statsData] = await Promise.all([
        registrationService.getByProgram(selectedProgram),
        registrationService.getStats(selectedProgram)
      ]);

      setRegistrations(regs);
      
      // Calculate additional stats
      const byGrade: Record<string, number> = {};
      const bySchool: Record<string, number> = {};
      
      regs.forEach(reg => {
        reg.students.forEach(student => {
          // Count by grade
          const grade = student.grade.toString();
          byGrade[grade] = (byGrade[grade] || 0) + 1;
          
          // Count by school
          const school = student.school || 'Unknown';
          bySchool[school] = (bySchool[school] || 0) + 1;
        });
      });

      setStats({
        total: statsData.totalStudents,
        pending: statsData.pending,
        active: statsData.active,
        waitlist: statsData.waitlist,
        byGrade,
        bySchool
      });
    } catch (error) {
      console.error('Error loading registration data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load registration data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function exportData() {
    try {
      const csvHeaders = [
        'Guardian Name',
        'Guardian Email',
        'Guardian Phone',
        'Student Name',
        'Student Grade',
        'Student School',
        'Status',
        'Registration Date'
      ];

      const csvRows = registrations.flatMap(reg => 
        reg.students.map(student => [
          reg.guardianName,
          reg.guardianEmail,
          reg.guardianPhone,
          student.name,
          student.grade,
          student.school || '',
          reg.status,
          new Date(reg.createdAt).toLocaleDateString()
        ])
      );

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations-${selectedProgram}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: 'Registration data exported to CSV',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export registration data',
        variant: 'destructive',
      });
    }
  }

  if (!hasPermission('view_reports')) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">You don't have permission to view reports.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registration Report</h1>
          <p className="text-muted-foreground">
            View and export registration data
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mathcounts-2025">MathCounts 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across {registrations.length} families
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Confirmed registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.waitlist || 0}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for space
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Students by Grade</CardTitle>
            <CardDescription>Distribution across grade levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats && Object.entries(stats.byGrade)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="text-sm">Grade {grade}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* School Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Students by School</CardTitle>
            <CardDescription>Top schools by enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats && Object.entries(stats.bySchool)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([school, count]) => (
                  <div key={school} className="flex items-center justify-between">
                    <span className="text-sm truncate max-w-[200px]">{school}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>Latest registration submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guardian</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.slice(0, 10).map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{reg.guardianName}</p>
                      <p className="text-sm text-muted-foreground">{reg.guardianEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {reg.students.map((student, i) => (
                      <div key={i} className="text-sm">
                        {student.name} (Grade {student.grade})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reg.status === 'active' ? 'default' :
                        reg.status === 'pending' ? 'secondary' :
                        'outline'
                      }
                    >
                      {reg.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}