import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "./ui/badge";

const challenges = [
    {
        title: "The Great Algae Investigation",
        status: "Completed",
        grade: "A+",
        description: "Identify three types of local algae. Document their characteristics using Markdown for formatting and submit photos. For extra credit, include LaTeX formulas for their growth rates. `$$ P(t) = P_0 e^{rt} $$`"
    },
    {
        title: "Tidal Zone Treasure Hunt",
        status: "In Progress",
        grade: null,
        description: "Explore a local tidal zone and document five different organisms you find. Describe their adaptations to this challenging environment. Use bullet points for each organism."
    },
    {
        title: "DIY Salinity Tester",
        status: "Not Started",
        grade: null,
        description: "Build a simple device to measure water salinity. Follow the provided guide and document your process with a step-by-step list."
    },
];

export function WeeklyChallenges() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Weekly Challenges</CardTitle>
        <CardDescription>
          Engage in hands-on learning and test your knowledge.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1">
            {challenges.map((challenge, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-4 w-full pr-4">
                            <span>{challenge.title}</span>
                            <div className="ml-auto flex items-center gap-2">
                                {challenge.grade && <Badge variant="default">{challenge.grade}</Badge>}
                                <Badge variant={challenge.status === 'Completed' ? 'secondary' : challenge.status === 'In Progress' ? 'outline' : 'destructive'}>{challenge.status}</Badge>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                        <p>{challenge.description}</p>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
