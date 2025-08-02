import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentGeneratorForm } from '@/components/content-generator-form';

export default function ContentGeneratorPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Content Generator</h1>
      <Tabs defaultValue="program" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="program">Program Generator</TabsTrigger>
          <TabsTrigger value="challenge">Challenge Generator</TabsTrigger>
        </TabsList>
        <TabsContent value="program">
          <Card>
            <CardHeader>
              <CardTitle>Program Description Generator</CardTitle>
              <CardDescription>
                Create compelling titles and descriptions for new programs using AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentGeneratorForm type="program" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="challenge">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Challenge Generator</CardTitle>
              <CardDescription>
                Generate exciting new weekly challenges for students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentGeneratorForm type="challenge" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
