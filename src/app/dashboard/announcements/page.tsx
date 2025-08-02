import { Announcements } from '@/components/announcements';

export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
      <div className="max-w-4xl">
        <Announcements />
      </div>
    </div>
  );
}
