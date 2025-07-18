import { useMemo } from "react"
import { format } from "date-fns"
import { DEFAULT_COLUMNS, getTimeForTimezone } from "@/lib/timezone-utils"

export interface TimeRow {
  index: number
  times: Record<string, Date>
  isCurrentTime: boolean
  isNextDay: boolean
}

export const useTimeRows = (
  selectedDate: Date,
  currentRowIndex: number,
  getTimeForTimezone: (baseTime: Date, timezone: string, selectedDate: Date) => Date
): TimeRow[] => {
  return useMemo(() => {
    const rows: TimeRow[] = []
    const baseDate = new Date(selectedDate)
    baseDate.setHours(0, 0, 0, 0)

    for (let i = 0; i <= 48; i++) {
      const currentBaseTime = new Date(baseDate.getTime() + i * 30 * 60 * 1000)
      const row: TimeRow = {
        index: i,
        times: {},
        isCurrentTime: i === currentRowIndex && format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
        isNextDay: i === 48,
      }

      DEFAULT_COLUMNS.forEach((timezone) => {
        row.times[timezone] = getTimeForTimezone(currentBaseTime, timezone, selectedDate)
      })

      rows.push(row)
    }

    return rows
  }, [selectedDate, currentRowIndex, getTimeForTimezone])
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
