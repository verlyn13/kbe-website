import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Trophy, Users, Book, Target, Heart } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PublicHeader } from '@/components/public-header';

export default function MathCountsPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-background">
        <div className="container py-8">
        <div className="mb-8">
          <Badge className="mb-4">Registration Open</Badge>
          <h1 className="text-4xl font-bold tracking-tight">MathCounts at Homer</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Join our team and discover the excitement of competitive mathematics!
          </p>
          <div className="mt-6 flex gap-4">
            <Button asChild size="lg">
              <Link href="/register">Register for 2025 Season</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://www.mathcounts.org/" target="_blank">
                Visit MathCounts.org
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About MathCounts</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  MathCounts is a national mathematics competition program that promotes
                  achievement through fun and engaging "bee" style contests. The program builds
                  problem-solving skills and fosters achievement through four levels of competition:
                  school, chapter, state, and national.
                </p>
                <p>
                  Our Homer chapter welcomes students in grades 4-8 who enjoy mathematics and
                  want to challenge themselves in a supportive team environment. Whether you're
                  aiming for nationals or just want to improve your math skills, MathCounts
                  has something for everyone.
                </p>
              </CardContent>
            </Card>

            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                <TabsTrigger value="expectations">Expectations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Schedule</CardTitle>
                    <CardDescription>
                      Regular practice sessions to prepare for competitions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Weekly Meetings</p>
                          <p className="text-sm text-muted-foreground">Every Tuesday</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p className="text-sm text-muted-foreground">4:00-5:30 PM</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">Homer Middle School, Room 203</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Users className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">First Meeting</p>
                          <p className="text-sm text-muted-foreground">Tuesday, September 9, 2025</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 mt-4">
                      <p className="text-sm">
                        <strong>Note:</strong> No meetings during school holidays or breaks.
                        Parents will be notified of any schedule changes via email.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="competitions">
                <Card>
                  <CardHeader>
                    <CardTitle>Competition Schedule</CardTitle>
                    <CardDescription>
                      Key dates for the 2025 competition season
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <Trophy className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold">Chapter Competition</p>
                            <p className="text-sm text-muted-foreground">Saturday, January 18, 2025</p>
                            <p className="text-sm mt-1">
                              Local competition hosted at Homer High School. Top teams advance to state.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <Trophy className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold">State Competition</p>
                            <p className="text-sm text-muted-foreground">Saturday, March 8, 2025</p>
                            <p className="text-sm mt-1">
                              Statewide competition in Anchorage. Top teams advance to nationals.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <Trophy className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold">National Competition</p>
                            <p className="text-sm text-muted-foreground">May 11-14, 2025</p>
                            <p className="text-sm mt-1">
                              For qualifying teams only. Location TBD.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="expectations">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Expectations</CardTitle>
                    <CardDescription>
                      What we expect from students and parents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Student Expectations
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                        <li>• Attend weekly practice sessions regularly</li>
                        <li>• Complete practice problems between meetings</li>
                        <li>• Support and encourage teammates</li>
                        <li>• Maintain good academic standing in school</li>
                        <li>• Participate in chapter competition</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Parent Support
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                        <li>• Ensure regular attendance at practices</li>
                        <li>• Provide transportation to/from meetings</li>
                        <li>• Support home practice time</li>
                        <li>• Volunteer for competition events when possible</li>
                        <li>• Communicate with coaches about conflicts</li>
                      </ul>
                    </div>
                    
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <p className="text-sm">
                        <strong>Philosophy:</strong> MathCounts is about more than competition.
                        We focus on building confidence, problem-solving skills, and a love for
                        mathematics that will serve students throughout their lives.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Open to grades 4-8</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">September - March season</span>
                </div>
                <div className="flex items-center gap-3">
                  <Book className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">No prior experience needed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">3 competition levels</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://www.mathcounts.org/resources/problem-of-the-week" target="_blank">
                    Problem of the Week Archive
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://www.mathcounts.org/resources/parents" target="_blank">
                    Parent Resources
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="#" target="_blank">
                    2024 Competition Handbook (PDF)
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Ready to Join?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 text-primary-foreground/90">
                  Registration is open for the 2025 season. Secure your spot today!
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/register">Register Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </main>
    </>
  );
}