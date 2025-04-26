import type { JobStatus } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, PlayCircle, XCircle, Loader, List } from "lucide-react";

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

const statusIcons: Record<keyof JobStats | 'total', React.ReactNode> = {
  total: <List className="h-5 w-5 text-muted-foreground" />,
  completed: <CheckCircle className="h-5 w-5 text-green-500" />,
  running: <Loader className="h-5 w-5 text-blue-500 animate-spin" />,
  failed: <XCircle className="h-5 w-5 text-red-500" />,
}

const statusLabels: Record<keyof JobStats, string> = {
  total: "Total Jobs",
  completed: "Completed",
  running: "Running",
  failed: "Failed",
}

export function JobStatusCards() {
  const stats = placeholderStats; // Replace with fetched data

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {(Object.keys(stats) as Array<keyof JobStats>).map((key) => (
         <Card key={key} className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{statusLabels[key]}</CardTitle>
             {statusIcons[key]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[key]}</div>
             {/* Optional: Add secondary text like percentage change */}
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
