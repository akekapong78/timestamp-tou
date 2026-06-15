# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

Deploy target is Vercel (`vercel --prod`). `BUILD_TIME` env var is injected at build time and shown in the footer.

## Architecture

Single-page Next.js 16 app (App Router, all client components) for analyzing Thai PEA electrical Time-of-Use (TOU) rates from 15-minute load profile data exported from Excel.

**Two modes** toggled via `Navbar` in `app/page.tsx`:
1. **Stamp Rate TOU** (`TouRateCalculator`) — paste datetime column (optionally with kW values); classifies each row as P / OP / H
2. **Shift kW Calculator** (`ShiftKWCalculator`) — paste datetime + kW columns; shifts non-zero kW values to align with the latest datetime sequence after a meter reset

### TOU Rate Logic (`app/utils/tou.ts`)

PEA TOU classification for Thailand:
- **P** (Peak): 09:15–22:00 on weekdays that are not holidays
- **OP** (Off-Peak): 00:00–09:14 and 22:01–23:59 on weekdays
- **H** (Holiday): Saturday, Sunday, or any date in `app/data/holidays.json`

Holidays are loaded once into a `Set<string>` keyed by `"YYYY-MM-DD"`. To update the holiday list, edit that JSON file.

`parseDatetimeToISO()` normalizes raw input (handling ` `, tabs, `.` as time separator, and the `24:xx` edge case via `normalize24()`) before classification.

### Data Flow

```
User pastes tab/space-separated text
  → split by line → parse date + optional kW value
  → parseDatetimeToISO() → getRateTOU()
  → Row[] state
  → Summary component (recharts chart, grouped by month)
  → ResultTable + CSV export
```

### Key Types (`app/interface/data.ts`)

- `Row` — `{ datetime, rate: "P"|"OP"|"H"|"error", value?: number|null }`
- `MonthSummary` — per-month max demand, kWh by rate, chart data array
- `ChartData` — per-row chart point with `kwP/kwOP/kwH` split lines and cumulative `kwh`

### Input Parsing

Both calculators accept pasted Excel data. Lines are split on whitespace (after normalizing ` ` and tabs). Date format is auto-detected from `navigator.language` (`en-US` → MM/DD, `ja` → ISO, otherwise DD/MM) and can be overridden via dropdown. Supported formats are defined in `app/constanst/datetime.ts` with ~32 format variants per base pattern in `app/utils/tou.ts`.

### Shift kW Logic (`app/utils/shiftTime.ts`)

`shiftNonZeroDown()` collects all non-zero values from a `Row[]`, then fills from the bottom of the array upward — so non-zero readings align with the latest datetimes after a meter counter reset.

### Summary Component (`app/components/Summary.tsx`)

When rows contain kW values, shows:
- Max demand (preferring Peak-rate rows) with datetime
- kWh breakdown by rate (formula: kWh = kW / 4 per 15-min slot)
- Multi-line Recharts chart with dual Y-axes (kW left, cumulative kWh right)
- Month selector dropdown when data spans multiple months
