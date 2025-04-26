import type { JobStatus } from "@/types";
import { Card, FlowLayout, H3, Text } from "@salt-ds/core";
import {
  CheckSolidIcon,
  RefreshIcon, // Using RefreshIcon for running state
  ErrorIcon,
  ListIcon, // Using ListIcon for total
  InfoIcon // Placeholder/default icon
} from "@salt-ds/icons";
import { Spinner } from "@salt-ds/lab"; // Import Spinner for running state
import * as React from 'react'; // Import React

interface JobStats {
  total: number;
  completed: number;
  running: number;
  failed: number;
}

// TODO: Replace with actual data fetching
const placeholderStats: JobStats = {
  total: 125,
  completed: 98,
  running: 15,
  failed: 12,
};

const statusInfo: Record<keyof JobStats | 'total', { icon: React.ReactNode; label: string; intent?: 'positive' | 'negative' | 'warning' | 'info'}> = {
  total: { icon: <ListIcon size={1} aria-hidden />, label: "Total Jobs", intent: "info" },
  completed: { icon: <CheckSolidIcon size={1} aria-hidden />, label: "Completed", intent: "positive" },
  // Using Spinner for running state
  running: { icon: <Spinner size="small" aria-label="Running" style={{ display: 'inline-flex' }}/>, label: "Running", intent: "info" },
  failed: { icon: <ErrorIcon size={1} aria-hidden />, label: "Failed", intent: "negative" },
};

export function JobStatusCards() {
  const stats = placeholderStats; // Replace with fetched data

  return (
    // Use FlowLayout for responsive wrapping grid
    <FlowLayout gap={2}>
      {(Object.keys(stats) as Array<keyof JobStats>).map((key) => {
         const info = statusInfo[key];
         return (
            <Card
                key={key}
                // Apply intent for visual distinction (optional)
                // accent={info.intent} // Card accent prop if desired
                style={{ flex: '1 1 200px', minWidth: '200px' }} // Responsive sizing
            >
                <H3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--salt-spacing-1)'}}>
                    <span>{info.label}</span>
                    {/* Conditionally render icon or spinner */}
                    {key === 'running' ? info.icon : React.cloneElement(info.icon as React.ReactElement, { 'aria-label': info.label })}
                </H3>
                <Text styleAs="h1" style={{ marginTop: 'var(--salt-spacing-1)', fontWeight: 'bold' }}>
                    {stats[key]}
                </Text>
                {/* Optional: Add secondary text */}
                {/* <Text styleAs="label" color="secondary">Description</Text> */}
            </Card>
         );
      })}
    </FlowLayout>
  );
}
