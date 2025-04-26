
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card"; // Added Card import
import type { JobStatus } from "@/types";


// TODO: Populate dataset types from an API or configuration
const datasetTypes = ["Customer", "Product", "Sales", "Inventory", "Logs"];
const jobStatuses: JobStatus[] = ["completed", "running", "failed", "pending"];

const filterFormSchema = z.object({
  datasetType: z.string().optional(),
  status: z.string().optional(), // Consider using z.enum([...jobStatuses, 'all']) if strict validation is needed
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
});

// Explicitly type the form values including the "all" possibility for select defaults
type FilterFormValuesInput = z.infer<typeof filterFormSchema> & {
    datasetType?: string | 'all'; // Allow 'all' for the select state
    status?: string | 'all'; // Allow 'all' for the select state
};

// Type for the filters passed to the handler (without "all")
export type FilterValues = Omit<FilterFormValuesInput, 'datasetType' | 'status'> & {
    datasetType?: string;
    status?: string;
};


interface FilterSectionProps {
    onApplyFilters: (filters: FilterValues) => void;
}

export function FilterSection({ onApplyFilters }: FilterSectionProps) {
  const form = useForm<FilterFormValuesInput>({ // Use the input type here
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
        datasetType: 'all', // Use 'all' as the default value
        status: 'all',      // Use 'all' as the default value
        dateRange: { from: undefined, to: undefined }
    }
  });

 function onSubmit(data: FilterFormValuesInput) {
    // Create a clean filter object to pass, converting "all" to undefined
    const cleanFilters: FilterValues = {
        dateRange: data.dateRange,
        datasetType: data.datasetType === 'all' ? undefined : data.datasetType,
        status: data.status === 'all' ? undefined : data.status,
    };
    console.log("Applying filters:", cleanFilters);
    onApplyFilters(cleanFilters);
    // TODO: Trigger data refetch for the grid based on these filters
  }

  return (
    <Card className="p-4 mb-6 shadow-sm bg-secondary">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-end md:gap-4">
          <FormField
            control={form.control}
            name="datasetType"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel>Dataset Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Use 'all' as value */}
                    <SelectItem value="all">All Types</SelectItem>
                    {datasetTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {/* Use 'all' as value */}
                    <SelectItem value="all">All Statuses</SelectItem>
                    {jobStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col min-w-[240px]">
                 <FormLabel>Date Range</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "LLL dd, y")} -{" "}
                              {format(field.value.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={{ from: field.value?.from, to: field.value?.to }}
                      onSelect={(range) => field.onChange(range || {from: undefined, to: undefined})}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
             <FilterIcon className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </form>
      </Form>
    </Card>
  );
}

