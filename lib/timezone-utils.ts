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

// Country code to flag emoji mapping using Unicode codepoints
export const COUNTRY_FLAGS: Record<string, string> = {
  "US": "\uD83C\uDDFA\uD83C\uDDF8", // 🇺🇸
  "CA": "\uD83C\uDDE8\uD83C\uDDE6", // 🇨🇦
  "GB": "\uD83C\uDDEC\uD83C\uDDE7", // 🇬🇧
  "AE": "\uD83C\uDDE6\uD83C\uDDEA", // 🇦🇪
  "IN": "\uD83C\uDDEE\uD83C\uDDF3", // 🇮🇳
  "JP": "\uD83C\uDDEF\uD83C\uDDF5", // 🇯🇵
  "AU": "\uD83C\uDDE6\uD83C\uDDFA", // 🇦🇺
}

// Fallback country name mapping if flags don't render
export const COUNTRY_NAMES: Record<string, string> = {
  "US": "USA",
  "CA": "Canada", 
  "GB": "UK",
  "AE": "UAE",
  "IN": "India",
  "JP": "Japan",
  "AU": "Australia",
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
    city: "Kolkata",
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

// Get formatted city name with country (using country names for better compatibility)
export const getFormattedCityName = (timezone: string): string => {
  const info = TIMEZONES[timezone]
  if (!info) return timezone
  
  const countryName = COUNTRY_NAMES[info.country] || info.country
  return `${info.city} (${countryName})`
}

// Version with flag emojis (use this if flags render properly)
export const getFormattedCityNameWithFlags = (timezone: string): string => {
  const info = TIMEZONES[timezone]
  if (!info) return timezone
  
  const flagEmoji = COUNTRY_FLAGS[info.country]
  const countryName = COUNTRY_NAMES[info.country] || info.country
  
  // Try flag emoji first, fallback to country name if not available
  const countryDisplay = flagEmoji || countryName
  return `${info.city} (${countryDisplay})`
}

// Alternative version that uses country names instead of flags
export const getFormattedCityNameWithCountry = (timezone: string): string => {
  const info = TIMEZONES[timezone]
  if (!info) return timezone
  
  const countryName = COUNTRY_NAMES[info.country] || info.country
  return `${info.city}, ${countryName}`
}

// Get formatted location display with timezone abbreviation
export const getFormattedLocationDisplay = (timezone: string, selectedDate: Date): string => {
  const tzInfo = getTimezoneInfo(timezone, selectedDate)
  const cityWithFlag = getFormattedCityName(timezone)
  return `${cityWithFlag}`
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
