import { Book, Calendar, Clock, Heart, MapPin, Target, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MathCountsPage() {
  return (
    <>
      <PublicHeader />
      <main className="bg-background min-h-screen">
        <div className="container py-8">
          <div className="mb-8">
            <Badge className="mb-4">Registration Open</Badge>
            <h1 className="text-4xl font-bold tracking-tight">MathCounts at Homer</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Join our team and discover the excitement of competitive mathematics!
            </p>
            <div className="mt-6 flex gap-4">
              <Button asChild size="lg">
                <Link href="/login">Register for 2025 Season</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://www.mathcounts.org/" target="_blank" rel="noopener">
                  Visit MathCounts.org
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About MathCounts</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <p>
                    MathCounts is a national mathematics competition program that promotes
                    achievement through fun and engaging "bee" style contests. The program builds
                    problem-solving skills and fosters achievement through four levels of
                    competition: school, chapter, state, and national.
                  </p>
                  <p>
                    Our Homer chapter welcomes students in grades 4-8 who enjoy mathematics and want
                    to challenge themselves in a supportive team environment. Whether you're aiming
                    for nationals or just want to improve your math skills, MathCounts has something
                    for everyone.
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
                          <Calendar className="text-primary mt-0.5 h-5 w-5" />
                          <div>
                            <p className="font-medium">Weekly Meetings</p>
                            <p className="text-muted-foreground text-sm">Every Tuesday</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Clock className="text-primary mt-0.5 h-5 w-5" />
                          <div>
                            <p className="font-medium">Time</p>
                            <p className="text-muted-foreground text-sm">4:00-5:30 PM</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <MapPin className="text-primary mt-0.5 h-5 w-5" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground text-sm">
                              Homer Middle School, Room 203
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Users className="text-primary mt-0.5 h-5 w-5" />
                          <div>
                            <p className="font-medium">First Meeting</p>
                            <p className="text-muted-foreground text-sm">
                              Tuesday, September 9, 2025
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted mt-4 rounded-lg p-4">
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
                      <CardDescription>Key dates for the 2025 competition season</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-start gap-3">
                            <Trophy className="mt-0.5 h-5 w-5 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-semibold">Chapter Competition</p>
                              <p className="text-muted-foreground text-sm">
                                Saturday, January 18, 2025
                              </p>
                              <p className="mt-1 text-sm">
                                Local competition hosted at Homer High School. Top teams advance to
                                state.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-start gap-3">
                            <Trophy className="mt-0.5 h-5 w-5 text-purple-600" />
                            <div className="flex-1">
                              <p className="font-semibold">State Competition</p>
                              <p className="text-muted-foreground text-sm">
                                Saturday, March 8, 2025
                              </p>
                              <p className="mt-1 text-sm">
                                Statewide competition in Anchorage. Top teams advance to nationals.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-start gap-3">
                            <Trophy className="mt-0.5 h-5 w-5 text-yellow-600" />
                            <div className="flex-1">
                              <p className="font-semibold">National Competition</p>
                              <p className="text-muted-foreground text-sm">May 11-14, 2025</p>
                              <p className="mt-1 text-sm">
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
                      <CardDescription>What we expect from students and parents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="mb-2 flex items-center gap-2 font-semibold">
                          <Target className="h-4 w-4" />
                          Student Expectations
                        </h4>
                        <ul className="text-muted-foreground ml-6 space-y-1 text-sm">
                          <li>• Attend weekly practice sessions regularly</li>
                          <li>• Complete practice problems between meetings</li>
                          <li>• Support and encourage teammates</li>
                          <li>• Maintain good academic standing in school</li>
                          <li>• Participate in chapter competition</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="mb-2 flex items-center gap-2 font-semibold">
                          <Heart className="h-4 w-4" />
                          Parent Support
                        </h4>
                        <ul className="text-muted-foreground ml-6 space-y-1 text-sm">
                          <li>• Ensure regular attendance at practices</li>
                          <li>• Provide transportation to/from meetings</li>
                          <li>• Support home practice time</li>
                          <li>• Volunteer for competition events when possible</li>
                          <li>• Communicate with coaches about conflicts</li>
                        </ul>
                      </div>

                      <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                        <p className="text-sm">
                          <strong>Philosophy:</strong> MathCounts is about more than competition. We
                          focus on building confidence, problem-solving skills, and a love for
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
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">Open to grades 4-8</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">September - March season</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Book className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">No prior experience needed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="text-muted-foreground h-4 w-4" />
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
                    <a
                      href="https://www.mathcounts.org/resources/problem-of-the-week"
                      target="_blank"
                      rel="noopener"
                    >
                      Problem of the Week Archive
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a
                      href="https://www.mathcounts.org/resources/parents"
                      target="_blank"
                      rel="noopener"
                    >
                      Parent Resources
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a
                      href="https://www.mathcounts.org/resources/handbook"
                      target="_blank"
                      rel="noopener"
                    >
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
                  <p className="text-primary-foreground/90 mb-4 text-sm">
                    Registration is open for the 2025 season. Secure your spot today!
                  </p>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href="/login">Register Now</Link>
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
