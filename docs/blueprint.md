# **App Name**: Enrichment Insights

## Core Features:

- Job Status Cards: Display total jobs, completed jobs, running jobs and failed jobs in separate cards.
- Filter Section: Implement a filter section with multiple filters like dataset type, status, date range and apply button, to filter enrichment runs.
- Enrichment Runs Grid: Display enrichment runs in a nested AG Grid, with nested dependent jobs.

## Style Guidelines:

- Primary color: Dark blue (#1A237E) for a professional look.
- Secondary color: Light grey (#EEEEEE) for backgrounds and separators.
- Accent: Teal (#00ACC1) for interactive elements and highlights.
- Use a clean and structured layout with clear separation of sections.
- Use simple and consistent icons to represent different job statuses and dataset types.
- Subtle animations for loading states and transitions to improve user experience.

## Original User Request:
Can you please create a a web app, which is used for dataset enrichment monitor. Use React typescript only for frontend, do not use nextjs
Beow is the requirement
1) Navbar should contain the app name on the left
2) Just below the navbar, there should be 4 cards that displays the total jobs, completed jobs, running jobs, failed jobs
3) Then below that a filter section and it can have mutiple filter slike, dataset type, status, date range, apple button
4) Below that, an aggrd which shows the enrichment runs, also every run can have nested dependent jobs, so use nested aggrid
  