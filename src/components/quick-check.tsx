import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowRight, BarChart, CheckCircle, Clock, XCircle, Car, CalendarDays } from "lucide-react";
import { Badge } from "./ui/badge";
import { MOCK_DATA } from "@/lib/constants";

/**
 * QuickCheck component provides a comprehensive dashboard overview for students and parents.
 * It displays three main sections: upcoming session information with attendance actions,
 * important alerts and notifications, and quick statistics about student performance.
 * The component serves as a central hub for immediate awareness of important information.
 * 
 * @component
 * @returns {JSX.Element} A card containing three grid sections for session info, alerts, and stats
 * 
 * @example
 * ```tsx
 * import { QuickCheck } from "@/components/quick-check";
 * 
 * function DashboardHome() {
 *   return (
 *     <div className="space-y-6">
 *       <QuickCheck />
 *       {/* Other dashboard components */}
 *     </div>
 *   );
 * }
 * ```
 */
export function QuickCheck() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Quick Check</CardTitle>
        <CardDescription>
          Your immediate overview for the week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Next Session */}
          <div className="flex flex-col gap-4 p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Next Session</h3>
            </div>
            <p className="font-bold text-2xl text-primary">Marine Biology</p>
            <p className="text-muted-foreground"><CalendarDays className="inline-block h-4 w-4 mr-2" />Tomorrow, 10:00 AM - 12:00 PM</p>
            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              <Button size="sm" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Attendance
              </Button>
              <Button size="sm" variant="outline">
                <XCircle className="mr-2 h-4 w-4" />
                Report Absence
              </Button>
               <Button size="sm" variant="outline">
                <Car className="mr-2 h-4 w-4" />
                Request Carpool
              </Button>
            </div>
          </div>

          {/* Alerts */}
          <div className="flex flex-col gap-4 p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <h3 className="font-semibold text-lg">Alerts</h3>
              <Badge variant="destructive" className="ml-auto">2</Badge>
            </div>
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="text-amber-500 mt-1"><AlertCircle size={16} /></div>
                    <p className="text-sm">Invoice {MOCK_DATA.INVOICE_ID} is due tomorrow.</p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="text-destructive mt-1"><AlertCircle size={16} /></div>
                    <p className="text-sm">Permission slip for field trip required.</p>
                </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-col gap-4 p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-3">
              <BarChart className="h-6 w-6 text-accent" />
              <h3 className="font-semibold text-lg">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-3xl font-bold">8/10</p>
                    <p className="text-sm text-muted-foreground">Sessions Attended</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Challenges Done</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold">{MOCK_DATA.SCORE_PERCENTAGE}%</p>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold">A-</p>
                    <p className="text-sm text-muted-foreground">Current Grade</p>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
