import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export function SessionCalendar() {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle>Session Calendar</CardTitle>
        <CardDescription>
          Upcoming sessions and program events.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <Calendar
          mode="single"
          selected={new Date()}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
}
