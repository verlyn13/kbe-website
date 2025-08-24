'use client';

import { ArrowLeft, Monitor, Moon, Palette, Sun } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/providers/theme-provider';

const themes = [
  {
    id: 'default',
    name: 'Default',
    description: 'Classic HEH theme with deep teal and gold accents',
    preview: {
      primary: '#008080',
      secondary: '#E0EEEE',
      accent: '#B8860B',
    },
  },
  {
    id: 'compass-peak',
    name: 'Compass Peak',
    description: 'Inspired by glacial faces and Kenai Mountains',
    preview: {
      primary: '#A6CDE3',
      secondary: '#E2E8F0',
      accent: '#F6AD55',
    },
  },
  {
    id: 'fireweed-path',
    name: 'Fireweed Path',
    description: 'Wildflower blooms and coastal rhythms',
    preview: {
      primary: '#d9469d',
      secondary: '#e8f0f7',
      accent: '#7fb069',
    },
  },
];

const modes = [
  { id: 'light', name: 'Light', icon: Sun, description: 'Bright mode for daytime use' },
  { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes for evening' },
  { id: 'system', name: 'System', icon: Monitor, description: 'Follows your device settings' },
];

export default function SettingsPage() {
  const { theme, setTheme, mode, setMode } = useTheme();

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience with themes and preferences
        </p>
      </div>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
          </CardTitle>
          <CardDescription>Choose a visual theme that suits your style</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={theme} onValueChange={(value) => setTheme(value as any)}>
            {themes.map((themeOption) => (
              <div key={themeOption.id} className="flex items-start space-y-0 space-x-3">
                <RadioGroupItem value={themeOption.id} id={themeOption.id} />
                <Label htmlFor={themeOption.id} className="flex-1 cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{themeOption.name}</span>
                      <div className="flex gap-1">
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: themeOption.preview.primary }}
                        />
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: themeOption.preview.secondary }}
                        />
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: themeOption.preview.accent }}
                        />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{themeOption.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Appearance Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Control light and dark mode preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={mode} onValueChange={(value) => setMode(value as any)}>
            {modes.map((modeOption) => {
              const Icon = modeOption.icon;
              return (
                <div key={modeOption.id} className="flex items-start space-y-0 space-x-3">
                  <RadioGroupItem value={modeOption.id} id={`mode-${modeOption.id}`} />
                  <Label htmlFor={`mode-${modeOption.id}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <div>
                        <span className="font-medium">{modeOption.name}</span>
                        <p className="text-muted-foreground text-sm">{modeOption.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your selected theme looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-background rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Sample Content</h3>
              <p className="text-muted-foreground mb-4">
                This is how regular text appears in your selected theme.
              </p>
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
