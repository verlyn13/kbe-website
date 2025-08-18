/**
 * Skip navigation link component for keyboard accessibility.
 * Allows users to skip repetitive navigation and jump to main content.
 */

/**
 * SkipNavigation component provides a keyboard-accessible link that becomes visible on focus.
 * This improves accessibility for keyboard and screen reader users by allowing them
 * to bypass repetitive navigation elements and jump directly to the main content area.
 *
 * @component
 * @returns {JSX.Element} A visually hidden link that appears on focus
 * @example
 * // Place at the very beginning of your layout
 * <SkipNavigation />
 */
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      Skip to main content
    </a>
  );
}
