import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';

interface DynamicImportOptions<P> {
  // Accept either a component or a function, we'll coerce to what next/dynamic expects
  loading?: ComponentType | ((props?: unknown) => ReactNode);
  ssr?: boolean;
  // suspense option is ignored here to match Next dynamic typings
}

/**
 * Wrapper for Next.js dynamic imports with consistent error handling
 */
export function createDynamicComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>,
  options: DynamicImportOptions<P> = {}
) {
  return dynamic(
    async () => {
      try {
        const mod = await importFn();
        return 'default' in mod ? mod : { default: mod };
      } catch (error) {
        console.error('Dynamic import failed:', error);
        // Return a fallback component
        return {
          default: () => (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              Failed to load component. Please refresh the page.
            </div>
          ),
        };
      }
    },
    {
      ssr: options.ssr ?? true,
      // next/dynamic expects a function signature; cast to any to avoid over-constraining
      loading: options.loading as any,
    }
  );
}

/**
 * Preload a dynamic component (for critical components)
 */
export function preloadComponent(
  importFn: () => Promise<any>
) {
  // Trigger the import but don't wait for it
  importFn().catch(console.error);
}
