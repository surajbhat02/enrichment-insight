import * as React from 'react';
import { SaltProvider, StackLayout } from '@salt-ds/core';
import { Navbar } from '@/components/layout/navbar';
import { JobStatusCards } from '@/features/enrichment-monitoring/components/job-status-cards';
import { FilterSection, type FilterValues } from '@/features/enrichment-monitoring/components/filter-section';
import { EnrichmentGrid } from '@/features/enrichment-monitoring/components/enrichment-grid';
import type { EnrichmentJob } from '@/types';

// --- Placeholder Data (Copied from original page.tsx) ---
const baseTime = new Date(2024, 3, 25, 10, 0, 0);
const allJobs: EnrichmentJob[] = [
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
   {
    id: "job-005",
    name: "Log Parsing",
    status: "completed",
    startTime: new Date(baseTime.getTime() - 1000 * 60 * 60 * 5), // 5:00 AM
    endTime: new Date(baseTime.getTime() - 1000 * 60 * 60 * 4), // 6:00 AM
    datasetType: "Logs",
  },
  {
    id: "job-006",
    name: "Customer Segmentation",
    status: "running",
    startTime: new Date(baseTime.getTime() - 1000 * 60 * 5), // 9:55 AM
    datasetType: "Customer",
  },
];
// --- End Placeholder Data ---

function App() {
  const [filteredJobs, setFilteredJobs] = React.useState<EnrichmentJob[]>(allJobs);

  // --- Filtering Logic (Copied from original page.tsx) ---
  const handleApplyFilters = (filters: FilterValues) => {
    let tempJobs = [...allJobs];

    if (filters.datasetType) {
      tempJobs = tempJobs.filter(job => job.datasetType === filters.datasetType);
    }

    if (filters.status) {
      tempJobs = tempJobs.filter(job => job.status === filters.status);
    }

    if (filters.dateRange?.from) {
      tempJobs = tempJobs.filter(job => job.startTime >= filters.dateRange!.from!);
    }
     if (filters.dateRange?.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        tempJobs = tempJobs.filter(job => job.startTime <= toDate);
    }
    setFilteredJobs(tempJobs);
  };
  // --- End Filtering Logic ---


  // Theme setup from original layout.tsx
  const themeOverrides = {
    primary: {
        50: "hsl(235, 60%, 90%)", 100: "hsl(235, 61%, 80%)", 200: "hsl(235, 61%, 70%)",
        300: "hsl(235, 61%, 60%)", 400: "hsl(235, 62%, 50%)", 500: "hsl(235, 62%, 40%)",
        600: "hsl(235, 62%, 29%)", 700: "hsl(235, 63%, 25%)", 800: "hsl(235, 63%, 20%)",
        900: "hsl(235, 65%, 15%)"
    },
    accent: {
        50: "hsl(187, 90%, 90%)", 100: "hsl(187, 95%, 80%)", 200: "hsl(187, 100%, 70%)",
        300: "hsl(187, 100%, 60%)", 400: "hsl(187, 100%, 50%)", 500: "hsl(187, 100%, 44%)",
        600: "hsl(187, 100%, 38%)", 700: "hsl(187, 100%, 32%)", 800: "hsl(187, 100%, 26%)",
        900: "hsl(187, 100%, 20%)"
    },
  };

  const saltThemeProps = {
     '--salt-container-background-medium': 'hsl(0, 0%, 93%)',
     '--salt-container-background-low': 'hsl(0, 0%, 98%)',
     '--salt-content-primary-foreground': 'hsl(0, 0%, 4%)',
     '--salt-text-primary-foreground': 'hsl(0, 0%, 4%)',
     '--salt-actionable-primary-foreground-default': 'hsl(0, 0%, 98%)',
     '--salt-actionable-cta-foreground-default': 'hsl(0, 0%, 98%)',
     '--salt-selectable-cta-foreground-selected': 'hsl(0, 0%, 98%)',
     '--salt-separable-primary-borderColor': 'hsl(0, 0%, 88%)',
  };


  return (
    <SaltProvider applyClassesTo={'html'} themeOverrides={themeOverrides} theme={saltThemeProps} density="medium" mode="light">
        <StackLayout direction="column" style={{ minHeight: '100vh' }}>
          <Navbar />
          <StackLayout gap={3} style={{ padding: 'var(--salt-spacing-3)', flexGrow: 1 }}>
              <JobStatusCards />
              <FilterSection onApplyFilters={handleApplyFilters}/>
              <EnrichmentGrid jobs={filteredJobs} />
          </StackLayout>
        </StackLayout>
     </SaltProvider>
  );
}

export default App;
