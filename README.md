# nextjs-preline-data-dashboards

Full-stack application built with NextJS, TypeScript, and Preline UI that provides dashboards for data visualisation.

# Setup

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos)
- `npm` / `pnpm` / `yarn`

## Running the app

- Open **Docker Desktop**
- Install dependencies with `pnpm install`
- Start database container with `supabase init`
- Navigate to `localhost:3000` or `localhost:3000/dashboard` in your browser

## Notes

- ⚠️ Changing date ranges to display data in must currently be done through the code. This will be changed through a DatePicker component later.
- ⚠️ Filtering data from the database is currently not possible. This will be changed through a Filters component later.
- ⚠️ Toggling comparison data on the dashboard is currently not possible and must be done through the code. This will be changed through ComparisonCheckbox components later.
