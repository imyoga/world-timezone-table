import { useMemo } from "react"
import { format } from "date-fns"
import { getTimeForTimezone, getTimezoneOffset, convertTimeToTimezone } from "@/lib/timezone-utils"

export interface TimeRow {
  index: number
  times: Record<string, Date>
  isCurrentTime: boolean
  isNextDay: boolean
}

export const useTimeRows = (
  selectedDate: Date,
  currentRowIndex: number,
  getTimeForTimezone: (baseTime: Date, timezone: string, selectedDate: Date, baseTimezone?: string) => Date,
  baseTimezone: string,
  dynamicColumns: string[] // Add dynamic columns parameter
): TimeRow[] => {
  return useMemo(() => {
    const rows: TimeRow[] = []
    
    // Create a base date at midnight in the base timezone
    const baseDate = new Date(selectedDate)
    baseDate.setHours(0, 0, 0, 0)

    for (let i = 0; i <= 48; i++) {
      // Always start from midnight (00:00) and increment by 30 minutes
      const currentBaseTime = new Date(baseDate.getTime() + i * 30 * 60 * 1000)
      const row: TimeRow = {
        index: i,
        times: {},
        isCurrentTime: i === currentRowIndex && format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
        isNextDay: i === 48,
      }

      // Calculate times for all timezones based on the base timezone time
      dynamicColumns.forEach((timezone) => {
        if (timezone === baseTimezone) {
          // For the base timezone, use the exact time we calculated
          row.times[timezone] = currentBaseTime
        } else {
          // For other timezones, convert the base time to that timezone
          // This ensures all columns show the same moment in time
          row.times[timezone] = convertTimeToTimezone(currentBaseTime, baseTimezone, timezone, selectedDate)
        }
      })

      rows.push(row)
    }

    return rows
  }, [selectedDate, currentRowIndex, getTimeForTimezone, baseTimezone, dynamicColumns])
}

export const useCurrentRowIndex = (currentTime: Date, baseTimezone: string): number => {
  return useMemo(() => {
    const baseTime = new Date(currentTime.toLocaleString("en-US", { timeZone: baseTimezone }))
    const hours = baseTime.getHours()
    const minutes = baseTime.getMinutes()
    const totalMinutes = hours * 60 + minutes
    return Math.floor(totalMinutes / 30)
  }, [currentTime, baseTimezone])
}
