
"use client"; // Required for state and event handlers

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { JobStatusCards } from "@/features/enrichment-monitoring/components/job-status-cards";
import { FilterSection, type FilterValues } from "@/features/enrichment-monitoring/components/filter-section";
import { EnrichmentGrid } from "@/features/enrichment-monitoring/components/enrichment-grid";
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
          <JobStatusCards />
          <FilterSection onApplyFilters={handleApplyFilters}/>
          {/* Pass the potentially filtered jobs */}
          <EnrichmentGrid jobs={filteredJobs} />
      </main>
    </>
  );
}

