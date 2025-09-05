# Calendar Recurring Schedule Plan

This note captures the plan to interpret recurring schedules stored in `Program.schedule`.

## Current Behavior
- `calendarService.generateRecurringEvents()` returns only the base event.
- UI surfaces a single event per program; recurring details are not expanded.

## Proposed JSON Shape
```json
{
  "recurring": true,
  "pattern": {
    "type": "weekly",
    "weekdays": [2],
    "startTime": "16:00",
    "endTime": "17:30",
    "until": "2025-03-11"
  },
  "location": "Homer Middle School, Room 203"
}
```

## Implementation Sketch
- Parse `pattern` in `generateRecurringEvents(program)`.
- Expand occurrences from `program.startDate` to `pattern.until`.
- Emit `CalendarEvent[]` with computed start/end for each occurrence.
- Keep backwards-compatible default when `recurring` or `pattern` missing.

## Next Steps
- Confirm JSON shape
- Add unit tests for weekly expansion
- Introduce feature flag for expansion rollout

