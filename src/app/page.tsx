
"use client"; // Required for state and event handlers

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { JobStatusCards } from "@/components/dashboard/job-status-cards";
import { FilterSection } from "@/components/dashboard/filter-section";
import { EnrichmentGrid } from "@/components/dashboard/enrichment-grid";
import type { EnrichmentJob, JobStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card"; // Import Card for wrapping

// Placeholder Data - Use static dates to avoid hydration issues
const baseTime = new Date(2024, 3, 25, 10, 0, 0); // Example: April 25, 2024 10:00:00

const allJobs: EnrichmentJob[] = [
   {
    id: "job-001",
    name: "Customer Data Cleansing",
    status: "completed",
    startTime: new Date(baseTime.getTime() - 1000 * 60 * 60 * 2), // 8:00 AM
    endTime: new Date(baseTime.getTime() - 1000 * 60 * 30),     // 9:30 AM
    datasetType: "Customer",
    dependentJobs: [
      { id: "dep-001a", name: "Address Validation", status: "completed", startTime: new Date(baseTime.getTime() - 1000 * 60 * 60 * 2), endTime: new Date(baseTime.getTime() - 1000 * 60 * 50), datasetType: "Customer" }, // 8:00 AM -> 9:10 AM
      { id: "dep-001b", name: "Duplicate Check", status: "completed", startTime: new Date(baseTime.getTime() - 1000 * 60 * 45), endTime: new Date(baseTime.getTime() - 1000 * 60 * 30), datasetType: "Customer" }, // 9:15 AM -> 9:30 AM
    ],
  },
  {
    id: "job-002",
    name: "Product Feature Extraction",
    status: "running",
    startTime: new Date(baseTime.getTime() - 1000 * 60 * 15), // 9:45 AM
    datasetType: "Product",
    dependentJobs: [
       { id: "dep-002a", name: "Image Analysis", status: "running", startTime: new Date(baseTime.getTime() - 1000 * 60 * 15), datasetType: "Product" }, // 9:45 AM
       { id: "dep-002b", name: "Text Description NLP", status: "pending", startTime: new Date(baseTime.getTime() - 1000 * 60 * 5), datasetType: "Product" }, // 9:55 AM (as pending)
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


interface FilterValues {
  datasetType?: string;
  status?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export default function Home() {
  const [filteredJobs, setFilteredJobs] = React.useState<EnrichmentJob[]>(allJobs);
  const [isMounted, setIsMounted] = React.useState(false); // Track client mount

  React.useEffect(() => {
      setIsMounted(true); // Set mounted state after initial render
  }, []);


  // Basic filtering logic (replace with more robust logic if needed)
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
        // Adjust 'to' date to include the whole day
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        tempJobs = tempJobs.filter(job => job.startTime <= toDate);
    }


    setFilteredJobs(tempJobs);
  };


  // Use a key prop on EnrichmentGrid dependent on isMounted to force re-render
  // or pass isMounted down to the grid/rows if finer control is needed.
  // For simplicity, we'll just ensure the grid uses the initial static data for SSR.
  // The filtering logic will run client-side anyway.
  // No need to pass isMounted down explicitly if FilterSection and EnrichmentGrid
  // already handle client-side interactions correctly.

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Wrap cards, filters, and grid in a Card for visual grouping if desired */}
        {/* <Card className="p-6"> */}
          <JobStatusCards />
          <FilterSection onApplyFilters={handleApplyFilters}/>
          {/* Pass the potentially filtered jobs */}
          <EnrichmentGrid jobs={filteredJobs} />
        {/* </Card> */}
      </main>
       {/* Optional Footer */}
       {/* <footer className="bg-secondary py-4 mt-auto">
         <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
           © {new Date().getFullYear()} Enrichment Insights
         </div>
       </footer> */}
    </>
  );
}

