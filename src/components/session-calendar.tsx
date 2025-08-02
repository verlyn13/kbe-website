import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

/**
 * SessionCalendar component displays a calendar interface for viewing upcoming sessions and program events.
 * The component uses a date picker calendar widget to show scheduled activities and allows users to
 * navigate through different dates to view their educational session schedule.
 *
 * @component
 * @returns {JSX.Element} A card containing a calendar widget with current date selected
 *
 * @example
 * ```tsx
 * import { SessionCalendar } from "@/components/session-calendar";
 *
 * function SchedulePage() {
 *   return (
 *     <div className="grid gap-4">
 *       <SessionCalendar />
 *     </div>
 *   );
 * }
 * ```
 */
export function SessionCalendar() {
  return (
    <Card className="flex h-full flex-col shadow-lg">
      <CardHeader>
        <CardTitle>Session Calendar</CardTitle>
        <CardDescription>Upcoming sessions and program events.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow items-center justify-center">
        <Calendar mode="single" selected={new Date()} className="rounded-md" />
      </CardContent>
    </Card>
  );
}
