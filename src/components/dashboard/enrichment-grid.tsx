"use client";

import * as React from "react";
import type { EnrichmentJob, JobStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, CheckCircle, Loader, XCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils"; // Import the cn utility function

// Placeholder Data - Replace with actual fetched data and AG Grid
const placeholderJobs: EnrichmentJob[] = [
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
       { id: "dep-002b", name: "Text Description NLP", status: "pending", startTime: new Date(Date.now() - 1000 * 60 * 5), datasetType: "Product" }, // Changed pending startTime
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
];


const statusStyles: Record<JobStatus, { icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    completed: { icon: <CheckCircle className="h-4 w-4" />, variant: "secondary", className: "bg-green-100 text-green-800 border-green-300" },
    running: { icon: <Loader className="h-4 w-4 animate-spin" />, variant: "secondary", className: "bg-blue-100 text-blue-800 border-blue-300" },
    failed: { icon: <XCircle className="h-4 w-4" />, variant: "destructive", className: "bg-red-100 text-red-800 border-red-300" },
    pending: { icon: <Circle className="h-4 w-4" />, variant: "outline", className: "bg-gray-100 text-gray-600 border-gray-300" },
};

function JobRow({ job, level = 0, isExpanded, onToggleExpand }: { job: EnrichmentJob; level?: number; isExpanded: boolean; onToggleExpand: (id: string) => void }) {
  const hasChildren = job.dependentJobs && job.dependentJobs.length > 0;
  const statusInfo = statusStyles[job.status];

  const formatDateTime = (date?: Date) => {
    if (!date) return '-';
    // Show full date if older than a day, otherwise relative time
    if (Date.now() - date.getTime() > 1000 * 60 * 60 * 24) {
       return format(date, "MMM d, yyyy HH:mm");
    }
    return formatDistanceToNow(date, { addSuffix: true });
  }


  return (
    <>
      <TableRow className={level > 0 ? "bg-muted/50 hover:bg-muted" : "hover:bg-secondary/50"}>
        <TableCell style={{ paddingLeft: `${level * 1.5 + 1}rem` }}>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onToggleExpand(job.id)}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ) : (
              <span className="inline-block w-6"></span> // Placeholder for alignment
            )}
             <span className="font-medium">{job.name}</span>
           </div>
        </TableCell>
        <TableCell>
          <Badge variant={statusInfo.variant} className={cn("flex items-center gap-1 w-fit", statusInfo.className)}>
            {statusInfo.icon}
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell>{job.datasetType}</TableCell>
        <TableCell>{formatDateTime(job.startTime)}</TableCell>
        <TableCell>{job.status === 'running' || job.status === 'pending' ? '-' : formatDateTime(job.endTime)}</TableCell>
      </TableRow>
      {hasChildren && isExpanded && job.dependentJobs?.map((depJob) => (
        <JobRow
            key={depJob.id}
            job={depJob}
            level={level + 1}
            isExpanded={false} // Child rows are not expandable in this simple version
            onToggleExpand={() => {}} // No toggle for children here
         />
      ))}
    </>
  );
}


interface EnrichmentGridProps {
  jobs: EnrichmentJob[];
}

export function EnrichmentGrid({ jobs }: EnrichmentGridProps) {
 const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!jobs || jobs.length === 0) {
    return (
      <Card className="mt-6 shadow-sm">
        <CardHeader>
          <CardTitle>Enrichment Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No enrichment jobs found matching the criteria.</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="mt-6 shadow-sm">
      <CardHeader>
        <CardTitle>Enrichment Runs</CardTitle>
      </CardHeader>
      <CardContent>
        {/* AG Grid Placeholder */}
        {/* <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
            <p className="p-4 text-muted-foreground">AG Grid will be integrated here.</p>
            <p className="p-4 text-muted-foreground"> Requires installing 'ag-grid-react' and 'ag-grid-community'.</p>
         </div> */}
         {/* Basic Table Implementation */}
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dataset Type</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                 {jobs.map((job) => (
                    <JobRow
                        key={job.id}
                        job={job}
                        isExpanded={!!expandedRows[job.id]}
                        onToggleExpand={toggleExpand}
                    />
                ))}
            </TableBody>
         </Table>
      </CardContent>
    </Card>
  );
}

// Placeholder data needs to be outside the component for the default prop assignment
EnrichmentGrid.defaultProps = {
  jobs: placeholderJobs,
};
