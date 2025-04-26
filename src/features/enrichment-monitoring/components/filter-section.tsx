import * as React from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form"; // Keep react-hook-form
import { zodResolver } from "@hookform/resolvers/zod"; // Keep zodResolver
import { format, isValid, parse } from "date-fns";
import {
  Button,
  Dropdown,
  FormField,
  FormFieldLabel,
  FlowLayout,
  Option,
  Panel, // Use Panel instead of Card for grouping filters
} from "@salt-ds/core";
import { DateInput, DateValue } from "@salt-ds/lab"; // Use Salt DateInput
import { FilterIcon, CalendarIcon } from "@salt-ds/icons"; // Use Salt icons
import type { JobStatus } from "@/types";

// --- Data (Keep as is) ---
const datasetTypes = ["Customer", "Product", "Sales", "Inventory", "Logs"];
const jobStatuses: JobStatus[] = ["completed", "running", "failed", "pending"];
const ALL_VALUE = "all"; // Constant for 'all' option value

// --- Schema (Keep as is) ---
const filterFormSchema = z.object({
  datasetType: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.object({
    // Store dates as strings for DateInput compatibility, convert on submit
    from: z.string().optional(),
    to: z.string().optional(),
  }).optional(),
});

// Type for form values used by react-hook-form (stores dates as strings)
type FilterFormValuesInput = z.infer<typeof filterFormSchema>;

// Type for the filters passed to the handler (converts dates to Date objects)
export type FilterValues = {
    datasetType?: string;
    status?: string;
    dateRange?: {
        from?: Date;
        to?: Date;
    }
};

// --- Component ---
interface FilterSectionProps {
    onApplyFilters: (filters: FilterValues) => void;
}

// Helper to safely parse date strings
const parseDate = (dateString?: string): Date | undefined => {
  if (!dateString) return undefined;
  const parsed = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function FilterSection({ onApplyFilters }: FilterSectionProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FilterFormValuesInput>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
        datasetType: ALL_VALUE,
        status: ALL_VALUE,
        dateRange: { from: undefined, to: undefined }
    }
  });

 function onSubmit(data: FilterFormValuesInput) {
    const cleanFilters: FilterValues = {
        datasetType: data.datasetType === ALL_VALUE ? undefined : data.datasetType,
        status: data.status === ALL_VALUE ? undefined : data.status,
        dateRange: {
            from: parseDate(data.dateRange?.from),
            to: parseDate(data.dateRange?.to)
        }
    };
    console.log("Applying filters:", cleanFilters);
    onApplyFilters(cleanFilters);
  }

  // Convert DateValue from DateInput to 'yyyy-MM-dd' string
  const handleDateChange = (fieldOnChange: (...event: any[]) => void) => (newDateValue?: DateValue) => {
      if (newDateValue) {
        // DateValue month is 0-indexed, Date constructor needs 0-indexed month
        fieldOnChange(format(new Date(newDateValue.year, newDateValue.month, newDateValue.day), 'yyyy-MM-dd'));
      } else {
        fieldOnChange(undefined);
      }
  };

  // Convert string 'yyyy-MM-dd' to DateValue for DateInput
  const stringToDateValue = (dateString?: string): DateValue | undefined => {
    if (!dateString) return undefined;
    try {
        const date = parse(dateString, 'yyyy-MM-dd', new Date());
        if (isValid(date)) {
            return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
        }
    } catch (e) {
        console.error("Error parsing date string for DateValue:", dateString, e);
    }
    return undefined;
  };


  return (
    // Use Panel for grouping filters, adjust variant as needed
    <Panel>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Use FlowLayout for responsive arrangement of filters */}
        <FlowLayout gap={2} align="end" style={{ padding: 'var(--salt-spacing-2)' }}>

          {/* Dataset Type Filter */}
          <Controller
            name="datasetType"
            control={control}
            render={({ field }) => (
              <FormField style={{ flex: '1 1 150px' }}>
                 <FormFieldLabel>Dataset Type</FormFieldLabel>
                 <Dropdown<string>
                    selected={field.value ? [field.value] : []}
                    onSelectionChange={(_, selectedItem) => field.onChange(selectedItem || ALL_VALUE)}
                    value={field.value} // Ensure Dropdown value is controlled
                    style={{ width: '100%' }}
                  >
                    <Option value={ALL_VALUE}>All Types</Option>
                    {datasetTypes.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Dropdown>
                 {/* Basic error display - improve as needed */}
                 {/* {errors.datasetType && <Text color="negative">{errors.datasetType.message}</Text>} */}
              </FormField>
            )}
          />

          {/* Status Filter */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormField style={{ flex: '1 1 150px' }}>
                 <FormFieldLabel>Status</FormFieldLabel>
                  <Dropdown<string>
                    selected={field.value ? [field.value] : []}
                    onSelectionChange={(_, selectedItem) => field.onChange(selectedItem || ALL_VALUE)}
                    value={field.value}
                    style={{ width: '100%' }}
                  >
                    <Option value={ALL_VALUE}>All Statuses</Option>
                    {jobStatuses.map((status) => (
                      <Option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Option>
                    ))}
                  </Dropdown>
                 {/* {errors.status && <Text color="negative">{errors.status.message}</Text>} */}
              </FormField>
            )}
          />

          {/* Date Range Filter */}
          {/* Using two DateInput fields for range start and end */}
          <Controller
              name="dateRange.from"
              control={control}
              render={({ field }) => (
                  <FormField style={{ flex: '1 1 180px' }}>
                      <FormFieldLabel>Start Date</FormFieldLabel>
                      <DateInput
                          selectedDate={stringToDateValue(field.value)}
                          onChange={handleDateChange(field.onChange)}
                          startAdornment={<CalendarIcon />}
                          inputProps={{ placeholder: "YYYY-MM-DD" }}
                          validationStatus={errors.dateRange?.from ? 'error' : undefined}
                      />
                  </FormField>
              )}
          />
          <Controller
              name="dateRange.to"
              control={control}
              render={({ field }) => (
                  <FormField style={{ flex: '1 1 180px' }}>
                      <FormFieldLabel>End Date</FormFieldLabel>
                      <DateInput
                          selectedDate={stringToDateValue(field.value)}
                          onChange={handleDateChange(field.onChange)}
                          startAdornment={<CalendarIcon />}
                           inputProps={{ placeholder: "YYYY-MM-DD" }}
                           validationStatus={errors.dateRange?.to ? 'error' : undefined}
                      />
                  </FormField>
              )}
          />


          {/* Apply Button */}
          <Button type="submit" variant="cta">
            <FilterIcon aria-hidden /> Apply Filters
          </Button>
        </FlowLayout>
      </form>
    </Panel>
  );
}
