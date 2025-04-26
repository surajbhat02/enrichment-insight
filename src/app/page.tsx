"use client"; // Required for state and event handlers

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { JobStatusCards } from "@/components/dashboard/job-status-cards";
import { FilterSection } from "@/components/dashboard/filter-section";
import { EnrichmentGrid } from "@/components/dashboard/enrichment-grid";
import type { EnrichmentJob, JobStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card"; // Import Card for wrapping

// Placeholder Data - Replace with actual data fetching logic
const allJobs: EnrichmentJob[] = [
   {
    id: "job-001",
    name: "Customer Data Cleansing",
    status: "completed",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    endTime: new Date(Date.now() - 1000 * 60 * 30),     // 30 mins ago
    datasetType: "Customer",
    dependentJobs: [
      { id: "dep-001a", name: "Address Validation", status: "completed", startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), endTime: new Date(Date.now() - 1000 * 60 * 50), datasetType: "Customer" },
      { id: "dep-001b", name: "Duplicate Check", status: "completed", startTime: new Date(Date.now() - 1000 * 60 * 45), endTime: new Date(Date.now() - 1000 * 60 * 30), datasetType: "Customer" },
    ],
  },
  {
    id: "job-002",
    name: "Product Feature Extraction",
    status: "running",
    startTime: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    datasetType: "Product",
    dependentJobs: [
       { id: "dep-002a", name: "Image Analysis", status: "running", startTime: new Date(Date.now() - 1000 * 60 * 15), datasetType: "Product" },
       { id: "dep-002b", name: "Text Description NLP", status: "pending", startTime: new Date(Date.now() - 1000 * 60 * 5), datasetType: "Product" },
    ],
  },
  {
    id: "job-003",
    name: "Sales Data Aggregation",
    status: "failed",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
    datasetType: "Sales",
  },
   {
    id: "job-004",
    name: "Inventory Stock Update",
    status: "pending",
    startTime: new Date(Date.now() + 1000 * 60 * 30), // Scheduled 30 mins from now
    datasetType: "Inventory",
  },
   {
    id: "job-005",
    name: "Log Parsing",
    status: "completed",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
    datasetType: "Logs",
  },
  {
    id: "job-006",
    name: "Customer Segmentation",
    status: "running",
    startTime: new Date(Date.now() - 1000 * 60 * 5),
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


  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Wrap cards, filters, and grid in a Card for visual grouping if desired */}
        {/* <Card className="p-6"> */}
          <JobStatusCards />
          <FilterSection onApplyFilters={handleApplyFilters}/>
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
