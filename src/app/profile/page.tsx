'use client';

import { ArrowLeft, Camera, Mail, Phone, Save, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useId } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { profileService, type UserProfile } from '@/lib/firebase-admin';

// Format phone number as user types
function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '');

  // Format based on length
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else {
    // Handle numbers with country code
    return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
  }
}

const mathPersonalities = [
  {
    type: 'Visual Learner',
    description:
      'Learns best through diagrams, charts, and visual representations of mathematical concepts.',
    icon: '👁️',
  },
  {
    type: 'Problem Solver',
    description: 'Enjoys tackling challenging problems and finding creative solutions.',
    icon: '🧩',
  },
  {
    type: 'Pattern Seeker',
    description: 'Excels at recognizing patterns and relationships in numbers and sequences.',
    icon: '🔍',
  },
  {
    type: 'Creative Thinker',
    description: 'Approaches math with imagination and finds unique ways to solve problems.',
    icon: '🎨',
  },
  {
    type: 'Logical Analyst',
    description: 'Thrives on step-by-step reasoning and systematic problem-solving approaches.',
    icon: '🔬',
  },
];

export default function ProfilePage() {
  const avatarUploadId = useId();
  const guardianNameId = useId();
  const displayNameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const bioId = useId();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [formData, setFormData] = useState({
    guardianName: '',
    displayName: '',
    email: '',
    phone: '',
    bio: '',
    children: [] as { name: string; preferredName?: string; grade: string }[],
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  async function loadProfile() {
    if (!user) return;

    try {
      const data = await profileService.get(user.uid);
      if (data) {
        setProfile(data);
        setFormData({
          guardianName: data.guardianName || '',
          displayName: data.displayName || data.guardianName || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          children: data.children || [],
        });
      } else {
        // Initialize with user's email
        setFormData((prev) => ({
          ...prev,
          email: user.email || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user) return;

    // Validate required fields
    if (!formData.guardianName || !formData.email || !formData.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate children have names and grades if any children are added
    for (const child of formData.children) {
      if (!child.name || !child.grade) {
        toast({
          title: 'Missing Child Information',
          description: 'Please provide name and grade for all children',
          variant: 'destructive',
        });
        return;
      }
    }

    setSaving(true);

    try {
      const profileData: any = {
        guardianName: formData.guardianName,
        displayName: formData.displayName || formData.guardianName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio || '',
        children: formData.children,
      };

      if (profile) {
        await profileService.update(user.uid, profileData);
      } else {
        await profileService.create(user.uid, profileData);
      }

      toast({
        title: 'Success',
        description: 'Profile saved successfully',
      });

      loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const avatarUrl = await profileService.uploadAvatar(user.uid, file);
      await profileService.update(user.uid, { avatarUrl });
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully',
      });
      loadProfile();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    }
  }

  function addChild() {
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, { name: '', preferredName: '', grade: '' }],
    }));
  }

  function removeChild(index: number) {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  }

  function updateChild(index: number, field: 'name' | 'preferredName' | 'grade', value: string) {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      ),
    }));
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    profile?.avatarUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.uid}`
                  }
                  alt={formData.guardianName}
                />
                <AvatarFallback>
                  {formData.guardianName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <label htmlFor={avatarUploadId} className="absolute right-0 bottom-0 cursor-pointer">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Camera className="h-4 w-4" />
                </div>
                <input
                  id={avatarUploadId}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {formData.displayName || formData.guardianName || 'Your Name'}
              </h2>
              <p className="text-muted-foreground">{formData.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="children">Children</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Required information for program communications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={guardianNameId}>
                    Guardian Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      id={guardianNameId}
                      placeholder="Your full name"
                      value={formData.guardianName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, guardianName: e.target.value }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={displayNameId}>Display Name (Optional)</Label>
                  <Input
                    id={displayNameId}
                    placeholder="How you'd like to be called"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, displayName: e.target.value }))
                    }
                  />
                  <p className="text-muted-foreground text-xs">Leave blank to use your full name</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={phoneId}>
                    <Phone className="mr-1 inline h-4 w-4" />
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={phoneId}
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setFormData((prev) => ({ ...prev, phone: formatted }));
                    }}
                    maxLength={14} // For format: (123) 456-7890
                  />
                  <p className="text-muted-foreground text-xs">US phone number format</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={emailId}>
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                  <Input
                    id={emailId}
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={bioId}>About You (Optional)</Label>
                <Textarea
                  id={bioId}
                  placeholder="Tell other families a bit about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
                <p className="text-muted-foreground text-sm">
                  This will be visible to other program participants
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="children" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Children</CardTitle>
              <CardDescription>
                Add your children's names and what they prefer to be called
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.children.map((child, index) => (
                <div key={index} className="space-y-4 rounded-lg border p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="Child's full name"
                        value={child.name}
                        onChange={(e) => updateChild(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Name</Label>
                      <Input
                        placeholder="What they like to be called"
                        value={child.preferredName || ''}
                        onChange={(e) => updateChild(index, 'preferredName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Grade <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={child.grade || ''}
                        onValueChange={(value) => updateChild(index, 'grade', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="K">Kindergarten</SelectItem>
                          <SelectItem value="1">1st Grade</SelectItem>
                          <SelectItem value="2">2nd Grade</SelectItem>
                          <SelectItem value="3">3rd Grade</SelectItem>
                          <SelectItem value="4">4th Grade</SelectItem>
                          <SelectItem value="5">5th Grade</SelectItem>
                          <SelectItem value="6">6th Grade</SelectItem>
                          <SelectItem value="7">7th Grade</SelectItem>
                          <SelectItem value="8">8th Grade</SelectItem>
                          <SelectItem value="9">9th Grade</SelectItem>
                          <SelectItem value="10">10th Grade</SelectItem>
                          <SelectItem value="11">11th Grade</SelectItem>
                          <SelectItem value="12">12th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => removeChild(index)}>
                      Remove Child
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addChild} className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Add Child
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Math Personality tab removed - will be added to individual student profiles */}
      </Tabs>
    </div>
  );
}
