
"use client";

import * as React from "react";
import type { EnrichmentJob, JobStatus } from "@/types";
import { DataGrid, Column, RowSelectionCheckboxColumn, CellRendererProps, ExpanderColumn, RowKeyGetter } from "@salt-ds/lab";
import { Badge, Text, FlexLayout, Panel, StatusIndicator } from "@salt-ds/core"; // Use Panel instead of Card
import { CheckSolidIcon, RefreshIcon, ErrorIcon, ClockIcon, InfoIcon } from "@salt-ds/icons"; // Salt icons
import { format } from 'date-fns';

// --- Placeholder Data (Keep as is) ---
const baseTime = new Date(2024, 3, 25, 10, 0, 0);
const placeholderJobs: EnrichmentJob[] = [
   {
    id: "job-001",
    name: "Customer Data Cleansing",
    status: "completed",
    startTime: new Date(baseTime.getTime() - 1000 * 60 * 60 * 2), // 8:00 AM
    endTime: new Date(baseTime.getTime() - 1000 * 60 * 30),     // 9:30 AM
    datasetType: "Customer",
    dependentJobs: [
      { id: "dep-001a", name: "Address Validation", status: "completed", startTime: new Date(baseTime.getTime() - 1000 * 60 * 60 * 2), endTime: new Date(baseTime.getTime() - 1000 * 60 * 50), datasetType: "Customer" },
      { id: "dep-001b", name: "Duplicate Check", status: "completed", startTime: new Date(baseTime.getTime() - 1000 * 60 * 45), endTime: new Date(baseTime.getTime() - 1000 * 60 * 30), datasetType: "Customer" },
    ],
  },
  {
    id: "job-002",
    name: "Product Feature Extraction",
    status: "running",
    startTime: new Date(baseTime.getTime() - 1000 * 60 * 15), // 9:45 AM
    datasetType: "Product",
    dependentJobs: [
       { id: "dep-002a", name: "Image Analysis", status: "running", startTime: new Date(baseTime.getTime() - 1000 * 60 * 15), datasetType: "Product" },
       { id: "dep-002b", name: "Text Description NLP", status: "pending", startTime: new Date(baseTime.getTime() - 1000 * 60 * 5), datasetType: "Product" },
    ],
  },
  {
    id: "job-003",
    name: "Sales Data Aggregation",
    status: "failed",
    startTime: new Date(baseTime.getTime() - 1000 * 60 * 60 * 24), // April 24, 10:00 AM
    endTime: new Date(baseTime.getTime() - 1000 * 60 * 60 * 23), // April 24, 11:00 AM
    datasetType: "Sales",
  },
   {
    id: "job-004",
    name: "Inventory Stock Update",
    status: "pending",
    startTime: new Date(baseTime.getTime() + 1000 * 60 * 30), // 10:30 AM (Scheduled)
    datasetType: "Inventory",
  },
];
// --- End Placeholder Data ---


// Status Indicator mapping for Salt
const statusIndicators: Record<JobStatus, { intent: 'positive' | 'negative' | 'info' | 'warning', icon?: React.ReactNode }> = {
    completed: { intent: "positive", icon: <CheckSolidIcon /> },
    running: { intent: "info", icon: <RefreshIcon /> }, // Or use Spinner if preferred
    failed: { intent: "negative", icon: <ErrorIcon /> },
    pending: { intent: "warning", icon: <ClockIcon /> }, // Using warning for pending
};

// Cell renderer for status
const StatusCell = ({ value }: CellRendererProps<EnrichmentJob, JobStatus>) => {
  const statusInfo = statusIndicators[value];
  if (!statusInfo) return <Text>{value}</Text>;

  return (
    <FlexLayout gap={0.5} align="center">
      <StatusIndicator intent={statusInfo.intent} />
      <Text style={{ textTransform: 'capitalize' }}>{value}</Text>
    </FlexLayout>
  );
};

// Cell renderer for dates
const DateCell = ({ value }: CellRendererProps<EnrichmentJob, Date | undefined>) => {
  if (!value) return <Text> - </Text>;
  // Format date consistently
  try {
     return <Text>{format(value, "MMM d, yyyy HH:mm:ss")}</Text>;
  } catch (e) {
    // Handle potential invalid date objects during SSR/hydration mismatches
    console.error("Error formatting date:", value, e);
    return <Text>Invalid Date</Text>;
  }
};

// Row key getter for DataGrid
const rowKeyGetter: RowKeyGetter<EnrichmentJob> = (row) => row.id;

// Function to check if a row has children
const hasChildren = (row: EnrichmentJob): boolean => !!row.dependentJobs && row.dependentJobs.length > 0;

// Function to get children for a row
const getChildRows = (row: EnrichmentJob): EnrichmentJob[] | undefined => row.dependentJobs;


interface EnrichmentGridProps {
  jobs: EnrichmentJob[];
}

export function EnrichmentGrid({ jobs }: EnrichmentGridProps) {
    // Use placeholderJobs for default props to ensure SSR consistency
    const displayJobs = jobs && jobs.length > 0 ? jobs : placeholderJobs;

    // State for expanded rows is handled internally by DataGrid via `isRowExpanded`/`setRowExpanded`

    if (!displayJobs || displayJobs.length === 0) {
    return (
      <Panel style={{ marginTop: 'var(--salt-spacing-3)'}}>
         <Text style={{ textAlign: 'center', padding: 'var(--salt-spacing-4)' }}>
          No enrichment jobs found matching the criteria.
        </Text>
      </Panel>
    );
  }


  return (
    <Panel style={{ marginTop: 'var(--salt-spacing-3)', overflow: 'hidden' }}>
        {/* Set height explicitly for DataGrid */}
        <div style={{ height: '600px', width: '100%' }}>
            <DataGrid<EnrichmentJob>
                rowData={displayJobs}
                rowKeyGetter={rowKeyGetter}
                zebra={true}
                // For nested data:
                getChildRows={getChildRows}
                // isRowExpanded={isRowExpanded} // Control expanded state if needed externally
                // setRowExpanded={setRowExpanded} // Control expanded state if needed externally
            >
                {/* Expander column for nested rows */}
                <ExpanderColumn<EnrichmentJob>
                    id="expander"
                    hasChildren={hasChildren} // Provide function to check for children
                />
                {/* Other columns */}
                <Column<EnrichmentJob>
                    id="name"
                    headerName="Job Name"
                    field="name"
                    defaultWidth={250}
                />
                 <Column<EnrichmentJob, JobStatus>
                    id="status"
                    headerName="Status"
                    field="status"
                    cellRenderer={StatusCell}
                    defaultWidth={150}
                 />
                 <Column<EnrichmentJob>
                    id="datasetType"
                    headerName="Dataset Type"
                    field="datasetType"
                    defaultWidth={150}
                 />
                <Column<EnrichmentJob, Date | undefined>
                    id="startTime"
                    headerName="Start Time"
                    field="startTime"
                    cellRenderer={DateCell}
                    defaultWidth={200}
                />
                <Column<EnrichmentJob, Date | undefined>
                    id="endTime"
                    headerName="End Time"
                    field="endTime"
                    cellRenderer={DateCell}
                    defaultWidth={200}
                 />
            </DataGrid>
        </div>
    </Panel>
  );
}

// Assign default props using the static placeholder data
EnrichmentGrid.defaultProps = {
  jobs: placeholderJobs,
};
