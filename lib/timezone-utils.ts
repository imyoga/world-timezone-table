// Timezone utility functions
export interface TimezoneInfo {
  name: string
  country: string
  city: string
  standardName: string
  daylightName: string
}

export interface ExtendedTimezoneInfo extends TimezoneInfo {
  currentName: string
  utcOffset: string
  isDST: boolean
}

export const TIMEZONES: Record<string, TimezoneInfo> = {
  "America/New_York": {
    name: "Eastern",
    country: "US",
    city: "New York",
    standardName: "EST",
    daylightName: "EDT",
  },
  "America/Chicago": {
    name: "Central",
    country: "US",
    city: "Chicago",
    standardName: "CST",
    daylightName: "CDT",
  },
  "America/Denver": {
    name: "Mountain",
    country: "US",
    city: "Denver",
    standardName: "MST",
    daylightName: "MDT",
  },
  "America/Los_Angeles": {
    name: "Pacific",
    country: "US",
    city: "Los Angeles",
    standardName: "PST",
    daylightName: "PDT",
  },
  "America/Edmonton": {
    name: "Mountain",
    country: "CA",
    city: "Edmonton",
    standardName: "MST",
    daylightName: "MDT",
  },
  "Europe/London": {
    name: "Greenwich",
    country: "GB",
    city: "London",
    standardName: "GMT",
    daylightName: "BST",
  },
  "Asia/Dubai": {
    name: "Gulf",
    country: "AE",
    city: "Dubai",
    standardName: "GST",
    daylightName: "GST",
  },
  "Asia/Kolkata": {
    name: "India",
    country: "IN",
    city: "Mumbai",
    standardName: "IST",
    daylightName: "IST",
  },
  "Asia/Tokyo": {
    name: "Japan",
    country: "JP",
    city: "Tokyo",
    standardName: "JST",
    daylightName: "JST",
  },
  "Australia/Sydney": {
    name: "Australian Eastern",
    country: "AU",
    city: "Sydney",
    standardName: "AEST",
    daylightName: "AEDT",
  },
}

export const DEFAULT_COLUMNS = [
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
]

export const isDSTActive = (date: Date, timezone: string): boolean => {
  const jan = new Date(date.getFullYear(), 0, 1)
  const jul = new Date(date.getFullYear(), 6, 1)

  const janOffset = getTimezoneOffset(jan, timezone)
  const julOffset = getTimezoneOffset(jul, timezone)
  const currentOffset = getTimezoneOffset(date, timezone)

  return currentOffset !== Math.max(janOffset, julOffset)
}

export const getTimezoneOffset = (date: Date, timezone: string): number => {
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
  const local = new Date(date.toLocaleString("en-US", { timeZone: timezone }))
  return (local.getTime() - utc.getTime()) / (1000 * 60 * 60)
}

export const formatUTCOffset = (offset: number): string => {
  const sign = offset >= 0 ? "+" : "-"
  const absOffset = Math.abs(offset)
  const hours = Math.floor(absOffset)
  const minutes = Math.round((absOffset - hours) * 60)

  if (minutes === 0) {
    return `UTC${sign}${hours}`
  }
  return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`
}

export const formatTime = (date: Date, format: "12h" | "24h"): string => {
  if (format === "24h") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export const getTimeForTimezone = (baseTime: Date, timezone: string, selectedDate: Date): Date => {
  const selectedDateTime = new Date(selectedDate)
  selectedDateTime.setHours(baseTime.getHours(), baseTime.getMinutes(), 0, 0)
  return new Date(selectedDateTime.toLocaleString("en-US", { timeZone: timezone }))
}

export const getTimezoneInfo = (timezone: string, selectedDate: Date): ExtendedTimezoneInfo => {
  const info = TIMEZONES[timezone]
  const isDST = isDSTActive(selectedDate, timezone)
  const offset = getTimezoneOffset(selectedDate, timezone)

  return {
    ...info,
    currentName: isDST ? info.daylightName : info.standardName,
    utcOffset: formatUTCOffset(offset),
    isDST,
  }
}

export const getGradientClass = (hour: number): string => {
  if (hour >= 6 && hour < 12) {
    return "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20"
  } else if (hour >= 12 && hour < 18) {
    return "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20"
  } else if (hour >= 18 && hour < 22) {
    return "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
  } else {
    return "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20"
  }
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
  }
}
