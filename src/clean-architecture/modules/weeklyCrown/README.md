# WeeklyCrown Module

This module provides automated weekly reports on recognition activity within the application.

## Features

- Scheduled weekly reports with customizable timing
- Email delivery with PDF attachments containing interactive charts
- Manual report generation via API
- Scheduler start/stop controls via API

## Configuration

The WeeklyCrown module can be configured using environment variables:

| Environment Variable | Description | Default Value |
|----------------------|-------------|---------------|
| `WEEKLY_REPORT_CRON` | Cron expression for report schedule | `0 7 * * 1` (Monday 7:00 AM UTC) |
| `WEEKLY_REPORT_RECIPIENT` | Email recipient for reports | `devraj.rajput@avestatechnologies.com` |
| `WEEKLY_REPORT_TIMEZONE` | Timezone for cron schedule | `UTC` |

### Cron Expression Format

Cron expressions follow the standard format:

```
┌────────── minute (0 - 59)
│ ┌──────── hour (0 - 23)
│ │ ┌────── day of month (1 - 31)
│ │ │ ┌──── month (1 - 12)
│ │ │ │ ┌── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

Common examples:
- `0 7 * * 1` - Every Monday at 7:00 AM
- `0 9 * * 1-5` - Every weekday at 9:00 AM
- `0 12 1 * *` - First day of every month at 12:00 PM

## API Endpoints

### Generate Report Manually

`POST /api/weekly-crown/reports`

Payload:
```json
{
  "startDate": "2023-01-01T00:00:00.000Z", // Optional, defaults to last week's start
  "endDate": "2023-01-07T23:59:59.999Z",   // Optional, defaults to last week's end
  "recipientEmail": "user@example.com"     // Optional, defaults to configured recipient
}
```

### Start Scheduler

`POST /api/weekly-crown/scheduler/start`

Payload:
```json
{
  "cronExpression": "0 7 * * 1" // Optional, defaults to configured cron schedule
}
```

### Stop Scheduler

`POST /api/weekly-crown/scheduler/stop`

## Usage in Code

To access configuration values from your code:

```typescript
import { weeklyCrownConfig } from 'src/clean-architecture/modules/weeklyCrown/config/env';

// Access config properties
const cronSchedule = weeklyCrownConfig.cronSchedule;
const recipient = weeklyCrownConfig.recipientEmail;
``` 