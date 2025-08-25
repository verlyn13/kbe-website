'use client';

import { Monitor, Moon, Palette, Sun } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/theme-provider';

const themes = [
  { id: 'default', name: 'Default', description: 'Classic HEH theme' },
  { id: 'compass-peak', name: 'Compass Peak', description: 'Mountain & glacier inspired' },
  { id: 'fireweed-path', name: 'Fireweed Path', description: 'Wildflower & coastal' },
];

const modes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'system', name: 'System', icon: Monitor },
];

export function ThemeSwitcher() {
  const { theme, setTheme, mode, setMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];
  const currentMode = modes.find((m) => m.id === mode) || modes[2];
  const ModeIcon = currentMode.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ModeIcon className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Mode Selection */}
        <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
          Mode
        </DropdownMenuLabel>
        {modes.map((modeOption) => {
          const Icon = modeOption.icon;
          return (
            <DropdownMenuItem key={modeOption.id} onClick={() => setMode(modeOption.id as any)}>
              <Icon className="mr-2 h-4 w-4" />
              <span>{modeOption.name}</span>
              {mode === modeOption.id && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Theme Selection */}
        <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
          Theme
        </DropdownMenuLabel>
        {themes.map((themeOption) => (
          <DropdownMenuItem key={themeOption.id} onClick={() => setTheme(themeOption.id as any)}>
            <Palette className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span>{themeOption.name}</span>
              <span className="text-muted-foreground text-xs">{themeOption.description}</span>
            </div>
            {theme === themeOption.id && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeSwitcherCompact() {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentMode = modes.find((m) => m.id === mode) || modes[2];
  const ModeIcon = currentMode.icon;

  const cycleMode = () => {
    const currentIndex = modes.findIndex((m) => m.id === mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex].id as any);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleMode}
      title={`Current: ${currentMode.name} mode`}
    >
      <ModeIcon className="h-5 w-5" />
      <span className="sr-only">Toggle theme mode</span>
    </Button>
  );
}
