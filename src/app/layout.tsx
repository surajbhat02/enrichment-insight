import type { Metadata } from 'next';
import './globals.css';
import { SaltProvider } from '@salt-ds/core';
import { ReactNode } from 'react';

// Import Salt theme CSS
import '@salt-ds/theme/index.css';

export const metadata: Metadata = {
  title: 'Enrichment Insights',
  description: 'Monitor your dataset enrichment jobs.',
};

// Define a custom theme function or object if needed for more complex overrides
// For simple overrides, we can use the `theme` prop directly.
const applyCustomTheme = (mode: 'light' | 'dark') => {
  const root = document.documentElement;
  if (mode === 'light') {
    // Primary: Dark blue (#1A237E) -> HSL approx 235, 62%, 29%
    // Secondary: Light grey (#EEEEEE) -> HSL approx 0, 0%, 93%
    // Accent: Teal (#00ACC1) -> HSL approx 187, 100%, 38%
    root.style.setProperty('--salt-color-primary-foreground-default', 'hsl(0, 0%, 98%)'); // Text on primary
    root.style.setProperty('--salt-accent-foreground-default', 'hsl(0, 0%, 98%)'); // Text on accent
    // Base Salt theme colors adjusted via themeOverrides prop in SaltProvider
  } else {
     // Define dark theme overrides if needed
     // Example:
    // root.style.setProperty('--salt-color-primary-foreground-default', 'hsl(0, 0%, 98%)');
    // root.style.setProperty('--salt-accent-foreground-default', 'hsl(0, 0%, 4%)');
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Basic theme overrides matching the proposal
  const themeOverrides = {
    // Using HSL values for Salt
    primary: {
        // Dark Blue #1A237E
        50: "hsl(235, 60%, 90%)", // Lighter shades for hover etc.
        100: "hsl(235, 61%, 80%)",
        200: "hsl(235, 61%, 70%)",
        300: "hsl(235, 61%, 60%)",
        400: "hsl(235, 62%, 50%)",
        500: "hsl(235, 62%, 40%)",
        600: "hsl(235, 62%, 29%)", // Base color
        700: "hsl(235, 63%, 25%)",
        800: "hsl(235, 63%, 20%)",
        900: "hsl(235, 65%, 15%)"  // Darker shades
    },
    accent: {
        // Teal #00ACC1
        50: "hsl(187, 90%, 90%)",
        100: "hsl(187, 95%, 80%)",
        200: "hsl(187, 100%, 70%)",
        300: "hsl(187, 100%, 60%)",
        400: "hsl(187, 100%, 50%)",
        500: "hsl(187, 100%, 44%)",
        600: "hsl(187, 100%, 38%)", // Base color
        700: "hsl(187, 100%, 32%)",
        800: "hsl(187, 100%, 26%)",
        900: "hsl(187, 100%, 20%)"
    },
    // Override neutral range for secondary/backgrounds if needed
    // Example: Light Grey #EEEEEE (approx HSL 0, 0%, 93%) could influence grey scale
    // Salt uses 'neutral' for backgrounds, borders etc.
    // Adjusting the base neutral color can impact the overall feel.
    // For simple background/border changes, overriding specific tokens might be better.
  };

  const saltThemeProps = {
     '--salt-container-background-medium': 'hsl(0, 0%, 93%)', // Light grey for secondary/muted backgrounds
     '--salt-container-background-low': 'hsl(0, 0%, 98%)', // Lighter grey for main background
     '--salt-content-primary-foreground': 'hsl(0, 0%, 4%)', // Dark text
     '--salt-text-primary-foreground': 'hsl(0, 0%, 4%)', // Dark text
     '--salt-actionable-primary-foreground-default': 'hsl(0, 0%, 98%)', // Text on primary buttons
     '--salt-actionable-cta-foreground-default': 'hsl(0, 0%, 98%)', // Text on accent buttons
     '--salt-selectable-cta-foreground-selected': 'hsl(0, 0%, 98%)', // Text on selected accent elements
     // Apply border colors etc. based on the Light Grey #EEEEEE theme if desired
     '--salt-separable-primary-borderColor': 'hsl(0, 0%, 88%)', // Border color
  };


  return (
    <html lang="en">
      {/* Apply density="high" for a more compact look, adjust as needed */}
      <SaltProvider applyClassesTo={'html'} themeOverrides={themeOverrides} theme={saltThemeProps} density="medium" mode="light">
          <body>
              {children}
              {/* Salt doesn't have a built-in Toaster like ShadCN.
                  You would need to integrate Salt's Notification component or a third-party library.
                  <SaltNotification /> or similar would go here if implemented.
              */}
          </body>
      </SaltProvider>
    </html>
  );
}
