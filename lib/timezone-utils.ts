// Timezone utility functions
export interface TimezoneInfo {
  name: string
  country: string
  city: string
  timezone: string
}

export interface ExtendedTimezoneInfo extends TimezoneInfo {
  currentName: string
  utcOffset: string
  isDST: boolean
}

// Minimal hardcoded data - only what we can't derive automatically
export const TIMEZONES: Record<string, TimezoneInfo> = {
  "America/New_York": {
    name: "Eastern",
    country: "US",
    city: "New York",
    timezone: "America/New_York",
  },
  "America/Chicago": {
    name: "Central", 
    country: "US",
    city: "Chicago",
    timezone: "America/Chicago",
  },
  "America/Denver": {
    name: "Mountain",
    country: "US", 
    city: "Denver",
    timezone: "America/Denver",
  },
  "America/Los_Angeles": {
    name: "Pacific",
    country: "US",
    city: "Los Angeles", 
    timezone: "America/Los_Angeles",
  },
  "America/Edmonton": {
    name: "Mountain",
    country: "CA",
    city: "Edmonton",
    timezone: "America/Edmonton",
  },
  "Europe/London": {
    name: "Greenwich",
    country: "GB",
    city: "London",
    timezone: "Europe/London",
  },
  "Asia/Dubai": {
    name: "Gulf",
    country: "AE",
    city: "Dubai",
    timezone: "Asia/Dubai",
  },
  "Asia/Kolkata": {
    name: "India",
    country: "IN",
    city: "Mumbai",
    timezone: "Asia/Kolkata",
  },
  "Asia/Tokyo": {
    name: "Japan",
    country: "JP",
    city: "Tokyo",
    timezone: "Asia/Tokyo",
  },
  "Australia/Sydney": {
    name: "Australian Eastern",
    country: "AU",
    city: "Sydney",
    timezone: "Australia/Sydney",
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

// Common timezone abbreviation mapping for consistent display
const TIMEZONE_ABBREVIATIONS: Record<string, { standard: string, daylight: string }> = {
  "Europe/London": { standard: "GMT", daylight: "BST" },
  "Asia/Dubai": { standard: "GST", daylight: "GST" },
  "Asia/Kolkata": { standard: "IST", daylight: "IST" },
  "Asia/Tokyo": { standard: "JST", daylight: "JST" },
  "Australia/Sydney": { standard: "AEST", daylight: "AEDT" },
}

// Get timezone abbreviation dynamically using Intl API with fallback to custom mapping
export const getTimezoneAbbreviation = (date: Date, timezone: string): string => {
  try {
    // First try the Intl API
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    })
    
    const parts = formatter.formatToParts(date)
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')
    const abbreviation = timeZoneName?.value
    
    // If we get a proper abbreviation (not GMT+X format), use it
    if (abbreviation && !abbreviation.startsWith('GMT') && !abbreviation.startsWith('UTC')) {
      return abbreviation
    }
    
    // Otherwise, use our custom mapping
    const customMapping = TIMEZONE_ABBREVIATIONS[timezone]
    if (customMapping) {
      const isDST = isDSTActive(date, timezone)
      return isDST ? customMapping.daylight : customMapping.standard
    }
    
    // Fallback to the Intl result or timezone name
    return abbreviation || timezone.split('/').pop() || timezone
  } catch (error) {
    // Final fallback
    const customMapping = TIMEZONE_ABBREVIATIONS[timezone]
    if (customMapping) {
      const isDST = isDSTActive(date, timezone)
      return isDST ? customMapping.daylight : customMapping.standard
    }
    return timezone.split('/').pop() || timezone
  }
}

// Get timezone display name dynamically
export const getTimezoneDisplayName = (timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long'
    })
    
    const parts = formatter.formatToParts(new Date())
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')
    
    return timeZoneName?.value || timezone.replace('_', ' ')
  } catch (error) {
    return timezone.replace('_', ' ')
  }
}

// Get all supported timezones from Intl API (if needed for future expansions)
export const getAllSupportedTimezones = (): string[] => {
  try {
    return Intl.supportedValuesOf('timeZone')
  } catch (error) {
    // Fallback to our defined timezones if Intl.supportedValuesOf is not available
    return Object.keys(TIMEZONES)
  }
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

export const formatTime = (date: Date, format: "12h" | "24h", includeSeconds: boolean = false): string => {
  if (format === "24h") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: includeSeconds ? "2-digit" : undefined,
      hour12: false,
    })
  }
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12: true,
  })
}

export const getTimeForTimezone = (baseTime: Date, timezone: string, selectedDate: Date): Date => {
  const selectedDateTime = new Date(selectedDate)
  selectedDateTime.setHours(baseTime.getHours(), baseTime.getMinutes(), baseTime.getSeconds(), 0)
  return new Date(selectedDateTime.toLocaleString("en-US", { timeZone: timezone }))
}

export const getTimezoneInfo = (timezone: string, selectedDate: Date): ExtendedTimezoneInfo => {
  const info = TIMEZONES[timezone]
  const isDST = isDSTActive(selectedDate, timezone)
  const offset = getTimezoneOffset(selectedDate, timezone)
  const currentName = getTimezoneAbbreviation(selectedDate, timezone)

  return {
    ...info,
    currentName,
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
