import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

/**
 * Announcement data structure containing announcement information
 */
interface Announcement {
  title: string;
  date: string;
  category: "Parents & Students" | "Parents" | "Students" | "General";
  content: string;
  color: string;
}

const announcements: Announcement[] = [
    {
        title: "Upcoming Field Trip to the Bay",
        date: "October 28, 2023",
        category: "Parents & Students",
        content: "We're excited to announce a field trip to study marine invertebrates. Permission slips are due by next Friday.",
        color: "bg-blue-500"
    },
    {
        title: "Parent-Teacher Conferences",
        date: "October 25, 2023",
        category: "Parents",
        content: "Sign-ups for parent-teacher conferences are now open. Please book your slot.",
        color: "bg-green-500"
    },
    {
        title: "New Challenge: 'Ocean Cleanup'",
        date: "October 23, 2023",
        category: "Students",
        content: "This week's challenge focuses on innovative ways to tackle ocean pollution. Get your thinking caps on!",
        color: "bg-teal-500"
    },
     {
        title: "Holiday Schedule Update",
        date: "October 20, 2023",
        category: "General",
        content: "Please note that there will be no sessions during the Thanksgiving week break.",
        color: "bg-gray-500"
    },
];

/**
 * Announcements component displays a scrollable list of community announcements.
 * Each announcement includes a title, date, category badge, content, and color-coded indicator.
 * The component provides a centralized way to view important updates for parents, students, and the general KBE community.
 * 
 * @component
 * @returns {JSX.Element} A card containing a scrollable list of announcements with footer action
 * 
 * @example
 * ```tsx
 * import { Announcements } from "@/components/announcements";
 * 
 * function CommunityPage() {
 *   return (
 *     <div className="grid gap-4">
 *       <Announcements />
 *     </div>
 *   );
 * }
 * ```
 */
export function Announcements() {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>
          Latest news and updates for the KBE community.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-6">
            {announcements.map((item, index) => (
                <div key={index} className="flex gap-4">
                    <div className={`w-1.5 rounded-full ${item.color}`}></div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                        <Badge variant="secondary" className="mt-1">{item.category}</Badge>
                        <p className="text-sm text-muted-foreground mt-2">{item.content}</p>
                    </div>
                </div>
            ))}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full">
            View All Announcements <ArrowRight className="ml-2 h-4 w-4"/>
        </Button>
      </CardFooter>
    </Card>
  );
}
