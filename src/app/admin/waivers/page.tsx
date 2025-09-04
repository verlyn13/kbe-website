'use client';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileCheck,
  FileX,
  Search,
  User,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  studentName: string;
  guardianId?: string;
  guardianName?: string | null;
  guardianEmail?: string | null;
  waiverStatus: 'pending' | 'received' | 'rejected' | 'expired';
  waiverDate?: Date;
  expiresDate?: Date;
}

export default function WaiversPage() {
  const { isAdmin, hasPermission } = useAdmin();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'received' | 'rejected'>(
    'all'
  );
  const [updating, setUpdating] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/waivers', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load students');
      const data = (await res.json()) as { students: Student[] };
      const sorted = [...data.students].sort((a, b) => {
        if (a.waiverStatus === 'pending' && b.waiverStatus !== 'pending') return -1;
        if (a.waiverStatus !== 'pending' && b.waiverStatus === 'pending') return 1;
        return a.studentName.localeCompare(b.studentName);
      });
      setStudents(sorted);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: 'Error',
        description: 'Failed to load student waivers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  async function updateWaiverStatus(
    studentId: string,
    newStatus: 'pending' | 'received' | 'rejected'
  ) {
    setUpdating(studentId);

    try {
      const res = await fetch(`/api/admin/waivers/${studentId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const data = (await res.json()) as { student: Student };

      // Update local state
      setStudents(students.map((s) => (s.id === studentId ? { ...s, ...data.student } : s)));

      toast({
        title: 'Success',
        description: `Waiver status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating waiver status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update waiver status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.guardianName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.guardianEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || student.waiverStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: students.length,
    pending: students.filter((s) => s.waiverStatus === 'pending').length,
    received: students.filter((s) => s.waiverStatus === 'received').length,
    rejected: students.filter((s) => s.waiverStatus === 'rejected').length,
  };

  if (!hasPermission('manage_users')) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">You don't have permission to manage waivers.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Waiver Management</h1>
        <p className="text-muted-foreground">Track and manage student liability waivers</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Waivers</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-muted-foreground text-xs">
              {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.received}</div>
            <p className="text-muted-foreground text-xs">
              {stats.total > 0 ? Math.round((stats.received / stats.total) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="text-destructive h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for pending waivers */}
      {stats.pending > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>{stats.pending} students</strong> are waiting for waiver approval. Students
            cannot participate in programs until their waiver is received.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Student Waivers</CardTitle>
          <CardDescription>Search and update waiver status for all students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search by student name, guardian, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
                <SelectItem value="received">Received Only</SelectItem>
                <SelectItem value="rejected">Rejected Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Guardian</TableHead>
                  {/* Removed Grade/School to simplify and reflect current schema */}
                  <TableHead>Status</TableHead>
                  <TableHead>Waiver Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground text-center">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="font-medium">{student.studentName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{student.guardianName || 'Unknown'}</p>
                          <p className="text-muted-foreground text-xs">{student.guardianEmail}</p>
                        </div>
                      </TableCell>
                      {/* No grade/school column in current Prisma model */}
                      <TableCell>
                        {student.waiverStatus === 'pending' && (
                          <Badge
                            variant="outline"
                            className="border-amber-200 bg-amber-50 text-amber-700"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                        {student.waiverStatus === 'received' && (
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-700"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Received
                          </Badge>
                        )}
                        {student.waiverStatus === 'rejected' && (
                          <Badge
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700"
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Rejected
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground text-sm">
                          {student.waiverDate ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {student.waiverDate.toLocaleDateString()}
                            </div>
                          ) : (
                            '-'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {student.waiverStatus !== 'received' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => updateWaiverStatus(student.id, 'received')}
                              disabled={updating === student.id}
                            >
                              <FileCheck className="h-4 w-4" />
                              Mark Received
                            </Button>
                          )}
                          {student.waiverStatus === 'received' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-amber-600 hover:text-amber-700"
                              onClick={() => updateWaiverStatus(student.id, 'pending')}
                              disabled={updating === student.id}
                            >
                              <Clock className="h-4 w-4" />
                              Mark Pending
                            </Button>
                          )}
                          {student.waiverStatus !== 'rejected' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => updateWaiverStatus(student.id, 'rejected')}
                              disabled={updating === student.id}
                            >
                              <FileX className="h-4 w-4" />
                              Reject
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
