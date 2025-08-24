// Typed wrapper for the generic DataTable specialized to Announcement rows
// Keeps strong typing when consumed through dynamic imports.

import type { ColumnDef } from '@tanstack/react-table';
import type { Announcement } from '@/lib/firebase-admin';
import { DataTable } from './data-table';

export interface AnnouncementTableProps {
  columns: ColumnDef<Announcement, unknown>[];
  data: Announcement[];
  searchKey?: string;
  onExport?: () => void;
  onEmailSelected?: (ids: string[]) => void;
}

export default function AnnouncementDataTable(props: AnnouncementTableProps) {
  return (
    <DataTable<Announcement, unknown>
      columns={props.columns}
      data={props.data}
      searchKey={props.searchKey}
      onExport={props.onExport}
      onEmailSelected={props.onEmailSelected}
    />
  );
}
