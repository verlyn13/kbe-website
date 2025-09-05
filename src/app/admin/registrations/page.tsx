'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Check, Clock, Eye, Mail, MoreHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/hooks/use-toast';
import { type RegistrationWithDetails, registrationService } from '@/lib/services';
import {
  mapRegistrationStatusEnumToLC,
  mapRegistrationStatusLCToEnum,
} from '@/types/enum-mappings';

export default function AdminRegistrationsPage() {
  const { admin } = useAdmin();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<RegistrationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'waitlist'>('all');

  const loadRegistrations = useCallback(async () => {
    try {
      const data = await registrationService.getAll();
      setRegistrations(data);
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load registrations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  async function handleStatusUpdate(
    id: string,
    status: 'pending' | 'active' | 'waitlist' | 'withdrawn'
  ) {
    try {
      await registrationService.updateStatus(id, mapRegistrationStatusLCToEnum(status));
      await loadRegistrations();
      toast({
        title: 'Success',
        description: `Registration ${status === 'active' ? 'approved' : 'updated'}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update registration status',
        variant: 'destructive',
      });
    }
  }

  const columns: ColumnDef<RegistrationWithDetails>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'parentName',
      header: 'Parent Name',
    },
    {
      accessorKey: 'parentEmail',
      header: 'Email',
    },
    {
      accessorKey: 'student',
      header: 'Students',
      cell: ({ row }) => {
        const s = row.getValue('student') as RegistrationWithDetails['student'];
        return <div className="text-sm">{s.name}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Registration Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt') as string | Date);
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(date);
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = mapRegistrationStatusEnumToLC(
          row.getValue('status') as RegistrationWithDetails['status']
        );
        const variant =
          status === 'active'
            ? 'default'
            : status === 'pending'
              ? 'secondary'
              : status === 'waitlist'
                ? 'outline'
                : 'destructive';

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => {
        const payment = row.getValue('paymentStatus') as RegistrationWithDetails['paymentStatus'];
        const variant = payment === 'completed' ? 'default' : 'outline';
        return <Badge variant={variant}>{payment}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const registration = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Email Parent
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {mapRegistrationStatusEnumToLC(registration.status) === 'pending' && (
                <>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(registration.id, 'active')}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(registration.id, 'waitlist')}>
                    <Clock className="mr-2 h-4 w-4" />
                    Add to Waitlist
                  </DropdownMenuItem>
                </>
              )}
              {mapRegistrationStatusEnumToLC(registration.status) === 'waitlist' && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(registration.id, 'active')}>
                  <Check className="mr-2 h-4 w-4" />
                  Move to Active
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(registration.id, 'withdrawn')}
                className="text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Withdraw
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredRegistrations =
    activeTab === 'all'
      ? registrations
      : registrations.filter((r) => mapRegistrationStatusEnumToLC(r.status) === activeTab);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registration Management</h1>
        <p className="text-muted-foreground">
          Review and manage student registrations for all programs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                registrations.filter((r) => mapRegistrationStatusEnumToLC(r.status) === 'pending')
                  .length
              }
            </div>
            <p className="text-muted-foreground text-xs">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                registrations.filter((r) => mapRegistrationStatusEnumToLC(r.status) === 'active')
                  .length
              }
            </div>
            <p className="text-muted-foreground text-xs">Currently enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Waitlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                registrations.filter((r) => mapRegistrationStatusEnumToLC(r.status) === 'waitlist')
                  .length
              }
            </div>
            <p className="text-muted-foreground text-xs">Waiting for space</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All Registrations</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration List</CardTitle>
              <CardDescription>
                Manage all student registrations for MathCounts 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredRegistrations}
                searchKey="parentName"
                onExport={() => {
                  // TODO: Implement export
                  console.log('Export registrations');
                }}
                onEmailSelected={(ids) => {
                  // TODO: Implement bulk email
                  console.log('Email selected:', ids);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
