import { ThemeImage, ThemeBackgroundImage } from '@/components/theme-image';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function ThemeShowcasePage() {
  return (
    <div className="relative min-h-screen">
      <ThemeBackgroundImage />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold">Theme Showcase</h1>
            <p className="text-muted-foreground">
              Switch themes to see the different visual styles
            </p>
            <div className="flex justify-center">
              <ThemeSwitcher />
            </div>
          </div>

          <div className="bg-card space-y-6 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold">Current Theme Image</h2>
            <div className="flex justify-center">
              <ThemeImage width={300} height={300} className="rounded-lg shadow-md" />
            </div>
            <p className="text-muted-foreground text-center">
              The Compass Peak theme features mountain and glacier imagery, while the Fireweed Path
              theme showcases Alaska's iconic wildflowers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary text-primary-foreground rounded-lg p-4">
              <h3 className="mb-2 font-semibold">Primary Color</h3>
              <p className="text-sm opacity-90">Used for main actions and branding</p>
            </div>
            <div className="bg-accent text-accent-foreground rounded-lg p-4">
              <h3 className="mb-2 font-semibold">Accent Color</h3>
              <p className="text-sm opacity-90">Used for highlights and emphasis</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Theme Descriptions</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="font-medium">Default:</span>
                <span className="text-muted-foreground">
                  Classic HEH theme with deep teal representing Homer's bay waters
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium">Compass Peak:</span>
                <span className="text-muted-foreground">
                  Mountain & glacier inspired with cool blues and slate grays
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium">Fireweed Path:</span>
                <span className="text-muted-foreground">
                  Wildflower & coastal with vibrant magenta and soft greens
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
