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
  "MX": "\uD83C\uDDF2\uD83C\uDDFD", // 🇲🇽
  "BR": "\uD83C\uDDE7\uD83C\uDDF7", // 🇧🇷
  "AR": "\uD83C\uDDE6\uD83C\uDDF7", // 🇦🇷
  "PE": "\uD83C\uDDF5\uD83C\uDDEA", // 🇵🇪
  "CO": "\uD83C\uDDE8\uD83C\uDDF4", // 🇨🇴
  "CL": "\uD83C\uDDE8\uD83C\uDDF1", // 🇨🇱
  "GB": "\uD83C\uDDEC\uD83C\uDDE7", // 🇬🇧
  "IE": "\uD83C\uDDEE\uD83C\uDDEA", // 🇮🇪
  "PT": "\uD83C\uDDF5\uD83C\uDDF9", // 🇵🇹
  "ES": "\uD83C\uDDEA\uD83C\uDDF8", // 🇪🇸
  "FR": "\uD83C\uDDEB\uD83C\uDDF7", // 🇫🇷
  "NL": "\uD83C\uDDF3\uD83C\uDDF1", // 🇳🇱
  "BE": "\uD83C\uDDE7\uD83C\uDDEA", // 🇧🇪
  "DE": "\uD83C\uDDE9\uD83C\uDDEA", // 🇩🇪
  "IT": "\uD83C\uDDEE\uD83C\uDDF9", // 🇮🇹
  "AT": "\uD83C\uDDE6\uD83C\uDDF9", // 🇦🇹
  "CH": "\uD83C\uDDE8\uD83C\uDDED", // 🇨🇭
  "SE": "\uD83C\uDDF8\uD83C\uDDEA", // �🇪
  "NO": "\uD83C\uDDF3\uD83C\uDDF4", // 🇳🇴
  "DK": "\uD83C\uDDE9\uD83C\uDDF0", // 🇩🇰
  "FI": "\uD83C\uDDEB\uD83C\uDDEE", // 🇫🇮
  "PL": "\uD83C\uDDF5\uD83C\uDDF1", // 🇵🇱
  "CZ": "\uD83C\uDDE8\uD83C\uDDFF", // 🇨🇿
  "HU": "\uD83C\uDDED\uD83C\uDDFA", // 🇭🇺
  "RO": "\uD83C\uDDF7\uD83C\uDDF4", // 🇷🇴
  "GR": "\uD83C\uDDEC\uD83C\uDDF7", // 🇬🇷
  "TR": "\uD83C\uDDF9\uD83C\uDDF7", // 🇹🇷
  "RU": "\uD83C\uDDF7\uD83C\uDDFA", // 🇷🇺
  "AE": "\uD83C\uDDE6\uD83C\uDDEA", // �🇦🇪
  "QA": "\uD83C\uDDF6\uD83C\uDDE6", // 🇶🇦
  "KW": "\uD83C\uDDF0\uD83C\uDDFC", // 🇰🇼
  "SA": "\uD83C\uDDF8\uD83C\uDDE6", // 🇸🇦
  "IR": "\uD83C\uDDEE\uD83C\uDDF7", // 🇮🇷
  "IL": "\uD83C\uDDEE\uD83C\uDDF1", // 🇮🇱
  "IN": "\uD83C\uDDEE\uD83C\uDDF3", // 🇮🇳
  "PK": "\uD83C\uDDF5\uD83C\uDDF0", // 🇵🇰
  "BD": "\uD83C\uDDE7\uD83C\uDDE9", // 🇧🇩
  "LK": "\uD83C\uDDF1\uD83C\uDDF0", // 🇱🇰
  "TH": "\uD83C\uDDF9\uD83C\uDDED", // 🇹🇭
  "SG": "\uD83C\uDDF8\uD83C\uDDEC", // 🇸🇬
  "MY": "\uD83C\uDDF2\uD83C\uDDFE", // 🇲🇾
  "ID": "\uD83C\uDDEE\uD83C\uDDE9", // 🇮�
  "PH": "\uD83C\uDDF5\uD83C\uDDED", // 🇵🇭
  "VN": "\uD83C\uDDFB\uD83C\uDDF3", // 🇻�🇳
  "JP": "\uD83C\uDDEF\uD83C\uDDF5", // 🇯🇵
  "KR": "\uD83C\uDDF0\uD83C\uDDF7", // 🇰🇷
  "CN": "\uD83C\uDDE8\uD83C\uDDF3", // 🇨🇳
  "HK": "\uD83C\uDDED\uD83C\uDDF0", // 🇭🇰
  "TW": "\uD83C\uDDF9\uD83C\uDDFC", // 🇹🇼
  "KZ": "\uD83C\uDDF0\uD83C\uDDFF", // 🇰🇿
  "UZ": "\uD83C\uDDFA\uD83C\uDDFF", // 🇺🇿
  "AU": "\uD83C\uDDE6\uD83C\uDDFA", // 🇦🇺
  "NZ": "\uD83C\uDDF3\uD83C\uDDFF", // 🇳🇿
  "EG": "\uD83C\uDDEA\uD83C\uDDEC", // 🇪🇬
  "NG": "\uD83C\uDDF3\uD83C\uDDEC", // 🇳🇬
  "ZA": "\uD83C\uDDFF\uD83C\uDDE6", // 🇿🇦
  "MA": "\uD83C\uDDF2\uD83C\uDDE6", // 🇲🇦
  "KE": "\uD83C\uDDF0\uD83C\uDDEA", // 🇰🇪
}

// Fallback country name mapping if flags don't render
export const COUNTRY_NAMES: Record<string, string> = {
  "US": "USA",
  "CA": "Canada", 
  "MX": "Mexico",
  "BR": "Brazil",
  "AR": "Argentina",
  "PE": "Peru",
  "CO": "Colombia",
  "CL": "Chile",
  "GB": "UK",
  "IE": "Ireland",
  "PT": "Portugal",
  "ES": "Spain",
  "FR": "France",
  "NL": "Netherlands",
  "BE": "Belgium",
  "DE": "Germany",
  "IT": "Italy",
  "AT": "Austria",
  "CH": "Switzerland",
  "SE": "Sweden",
  "NO": "Norway",
  "DK": "Denmark",
  "FI": "Finland",
  "PL": "Poland",
  "CZ": "Czech Republic",
  "HU": "Hungary",
  "RO": "Romania",
  "GR": "Greece",
  "TR": "Turkey",
  "RU": "Russia",
  "AE": "UAE",
  "QA": "Qatar",
  "KW": "Kuwait",
  "SA": "Saudi Arabia",
  "IR": "Iran",
  "IL": "Israel",
  "IN": "India",
  "PK": "Pakistan",
  "BD": "Bangladesh",
  "LK": "Sri Lanka",
  "TH": "Thailand",
  "SG": "Singapore",
  "MY": "Malaysia",
  "ID": "Indonesia",
  "PH": "Philippines",
  "VN": "Vietnam",
  "JP": "Japan",
  "KR": "South Korea",
  "CN": "China",
  "HK": "Hong Kong",
  "TW": "Taiwan",
  "KZ": "Kazakhstan",
  "UZ": "Uzbekistan",
  "AU": "Australia",
  "NZ": "New Zealand",
  "EG": "Egypt",
  "NG": "Nigeria",
  "ZA": "South Africa",
  "MA": "Morocco",
  "KE": "Kenya",
}

// Comprehensive list of world cities with their timezones
export const TIMEZONES: Record<string, TimezoneInfo> = {
  // UTC - Coordinated Universal Time
  "UTC": {
    name: "UTC",
    country: "ZZ", // Using ZZ for international/not applicable
    city: "UTC",
    timezone: "UTC",
  },
  
  // North America - USA
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
  "America/Phoenix": {
    name: "Mountain",
    country: "US",
    city: "Phoenix",
    timezone: "America/Phoenix",
  },
  "America/Anchorage": {
    name: "Alaska",
    country: "US",
    city: "Anchorage",
    timezone: "America/Anchorage",
  },
  "Pacific/Honolulu": {
    name: "Hawaii",
    country: "US",
    city: "Honolulu",
    timezone: "Pacific/Honolulu",
  },
  
  // North America - Canada
  "America/Toronto": {
    name: "Eastern",
    country: "CA",
    city: "Toronto",
    timezone: "America/Toronto",
  },
  "America/Montreal": {
    name: "Eastern",
    country: "CA",
    city: "Montreal",
    timezone: "America/Montreal",
  },
  "America/Vancouver": {
    name: "Pacific",
    country: "CA",
    city: "Vancouver",
    timezone: "America/Vancouver",
  },
  "America/Edmonton": {
    name: "Mountain",
    country: "CA",
    city: "Edmonton",
    timezone: "America/Edmonton",
  },
  "America/Calgary": {
    name: "Mountain",
    country: "CA",
    city: "Calgary",
    timezone: "America/Edmonton", // Calgary uses Edmonton timezone
  },
  "America/Winnipeg": {
    name: "Central",
    country: "CA",
    city: "Winnipeg",
    timezone: "America/Winnipeg",
  },
  
  // North America - Mexico
  "America/Mexico_City": {
    name: "Central",
    country: "MX",
    city: "Mexico City",
    timezone: "America/Mexico_City",
  },
  "America/Cancun": {
    name: "Eastern",
    country: "MX",
    city: "Cancun",
    timezone: "America/Cancun",
  },
  "America/Tijuana": {
    name: "Pacific",
    country: "MX",
    city: "Tijuana",
    timezone: "America/Tijuana",
  },

  // South America
  "America/Sao_Paulo": {
    name: "Brasilia",
    country: "BR",
    city: "São Paulo",
    timezone: "America/Sao_Paulo",
  },
  "America/Buenos_Aires": {
    name: "Argentina",
    country: "AR",
    city: "Buenos Aires",
    timezone: "America/Buenos_Aires",
  },
  "America/Lima": {
    name: "Peru",
    country: "PE",
    city: "Lima",
    timezone: "America/Lima",
  },
  "America/Bogota": {
    name: "Colombia",
    country: "CO",
    city: "Bogotá",
    timezone: "America/Bogota",
  },
  "America/Santiago": {
    name: "Chile",
    country: "CL",
    city: "Santiago",
    timezone: "America/Santiago",
  },
  
  // Europe - Western
  "Europe/London": {
    name: "Greenwich",
    country: "GB",
    city: "London",
    timezone: "Europe/London",
  },
  "Europe/Dublin": {
    name: "Greenwich",
    country: "IE",
    city: "Dublin",
    timezone: "Europe/Dublin",
  },
  "Europe/Lisbon": {
    name: "Western European",
    country: "PT",
    city: "Lisbon",
    timezone: "Europe/Lisbon",
  },
  "Europe/Madrid": {
    name: "Central European",
    country: "ES",
    city: "Madrid",
    timezone: "Europe/Madrid",
  },
  "Europe/Paris": {
    name: "Central European",
    country: "FR",
    city: "Paris",
    timezone: "Europe/Paris",
  },
  "Europe/Amsterdam": {
    name: "Central European",
    country: "NL",
    city: "Amsterdam",
    timezone: "Europe/Amsterdam",
  },
  "Europe/Brussels": {
    name: "Central European",
    country: "BE",
    city: "Brussels",
    timezone: "Europe/Brussels",
  },
  "Europe/Berlin": {
    name: "Central European",
    country: "DE",
    city: "Berlin",
    timezone: "Europe/Berlin",
  },
  "Europe/Rome": {
    name: "Central European",
    country: "IT",
    city: "Rome",
    timezone: "Europe/Rome",
  },
  "Europe/Vienna": {
    name: "Central European",
    country: "AT",
    city: "Vienna",
    timezone: "Europe/Vienna",
  },
  "Europe/Zurich": {
    name: "Central European",
    country: "CH",
    city: "Zurich",
    timezone: "Europe/Zurich",
  },
  
  // Europe - Nordic
  "Europe/Stockholm": {
    name: "Central European",
    country: "SE",
    city: "Stockholm",
    timezone: "Europe/Stockholm",
  },
  "Europe/Oslo": {
    name: "Central European",
    country: "NO",
    city: "Oslo",
    timezone: "Europe/Oslo",
  },
  "Europe/Copenhagen": {
    name: "Central European",
    country: "DK",
    city: "Copenhagen",
    timezone: "Europe/Copenhagen",
  },
  "Europe/Helsinki": {
    name: "Eastern European",
    country: "FI",
    city: "Helsinki",
    timezone: "Europe/Helsinki",
  },
  
  // Europe - Eastern
  "Europe/Warsaw": {
    name: "Central European",
    country: "PL",
    city: "Warsaw",
    timezone: "Europe/Warsaw",
  },
  "Europe/Prague": {
    name: "Central European",
    country: "CZ",
    city: "Prague",
    timezone: "Europe/Prague",
  },
  "Europe/Budapest": {
    name: "Central European",
    country: "HU",
    city: "Budapest",
    timezone: "Europe/Budapest",
  },
  "Europe/Bucharest": {
    name: "Eastern European",
    country: "RO",
    city: "Bucharest",
    timezone: "Europe/Bucharest",
  },
  "Europe/Athens": {
    name: "Eastern European",
    country: "GR",
    city: "Athens",
    timezone: "Europe/Athens",
  },
  "Europe/Istanbul": {
    name: "Turkey",
    country: "TR",
    city: "Istanbul",
    timezone: "Europe/Istanbul",
  },
  "Europe/Moscow": {
    name: "Moscow",
    country: "RU",
    city: "Moscow",
    timezone: "Europe/Moscow",
  },
  
  // Asia - Middle East
  "Asia/Dubai": {
    name: "Gulf",
    country: "AE",
    city: "Dubai",
    timezone: "Asia/Dubai",
  },
  "Asia/Qatar": {
    name: "Arabia",
    country: "QA",
    city: "Doha",
    timezone: "Asia/Qatar",
  },
  "Asia/Kuwait": {
    name: "Arabia",
    country: "KW",
    city: "Kuwait City",
    timezone: "Asia/Kuwait",
  },
  "Asia/Riyadh": {
    name: "Arabia",
    country: "SA",
    city: "Riyadh",
    timezone: "Asia/Riyadh",
  },
  "Asia/Tehran": {
    name: "Iran",
    country: "IR",
    city: "Tehran",
    timezone: "Asia/Tehran",
  },
  "Asia/Jerusalem": {
    name: "Israel",
    country: "IL",
    city: "Jerusalem",
    timezone: "Asia/Jerusalem",
  },
  
  // Asia - South Asia
  "Asia/Kolkata": {
    name: "India",
    country: "IN",
    city: "Mumbai",
    timezone: "Asia/Kolkata",
  },
  "Asia/Karachi": {
    name: "Pakistan",
    country: "PK",
    city: "Karachi",
    timezone: "Asia/Karachi",
  },
  "Asia/Dhaka": {
    name: "Bangladesh",
    country: "BD",
    city: "Dhaka",
    timezone: "Asia/Dhaka",
  },
  "Asia/Colombo": {
    name: "Sri Lanka",
    country: "LK",
    city: "Colombo",
    timezone: "Asia/Colombo",
  },
  
  // Asia - Southeast Asia
  "Asia/Bangkok": {
    name: "Indochina",
    country: "TH",
    city: "Bangkok",
    timezone: "Asia/Bangkok",
  },
  "Asia/Singapore": {
    name: "Singapore",
    country: "SG",
    city: "Singapore",
    timezone: "Asia/Singapore",
  },
  "Asia/Kuala_Lumpur": {
    name: "Malaysia",
    country: "MY",
    city: "Kuala Lumpur",
    timezone: "Asia/Kuala_Lumpur",
  },
  "Asia/Jakarta": {
    name: "Western Indonesia",
    country: "ID",
    city: "Jakarta",
    timezone: "Asia/Jakarta",
  },
  "Asia/Manila": {
    name: "Philippines",
    country: "PH",
    city: "Manila",
    timezone: "Asia/Manila",
  },
  "Asia/Ho_Chi_Minh": {
    name: "Indochina",
    country: "VN",
    city: "Ho Chi Minh City",
    timezone: "Asia/Ho_Chi_Minh",
  },
  
  // Asia - East Asia
  "Asia/Tokyo": {
    name: "Japan",
    country: "JP",
    city: "Tokyo",
    timezone: "Asia/Tokyo",
  },
  "Asia/Seoul": {
    name: "Korea",
    country: "KR",
    city: "Seoul",
    timezone: "Asia/Seoul",
  },
  "Asia/Shanghai": {
    name: "China",
    country: "CN",
    city: "Shanghai",
    timezone: "Asia/Shanghai",
  },
  "Asia/Hong_Kong": {
    name: "Hong Kong",
    country: "HK",
    city: "Hong Kong",
    timezone: "Asia/Hong_Kong",
  },
  "Asia/Taipei": {
    name: "Taiwan",
    country: "TW",
    city: "Taipei",
    timezone: "Asia/Taipei",
  },
  
  // Asia - Central Asia
  "Asia/Almaty": {
    name: "East Kazakhstan",
    country: "KZ",
    city: "Almaty",
    timezone: "Asia/Almaty",
  },
  "Asia/Tashkent": {
    name: "Uzbekistan",
    country: "UZ",
    city: "Tashkent",
    timezone: "Asia/Tashkent",
  },
  
  // Oceania
  "Australia/Sydney": {
    name: "Australian Eastern",
    country: "AU",
    city: "Sydney",
    timezone: "Australia/Sydney",
  },
  "Australia/Melbourne": {
    name: "Australian Eastern",
    country: "AU",
    city: "Melbourne",
    timezone: "Australia/Melbourne",
  },
  "Australia/Brisbane": {
    name: "Australian Eastern",
    country: "AU",
    city: "Brisbane",
    timezone: "Australia/Brisbane",
  },
  "Australia/Perth": {
    name: "Australian Western",
    country: "AU",
    city: "Perth",
    timezone: "Australia/Perth",
  },
  "Pacific/Auckland": {
    name: "New Zealand",
    country: "NZ",
    city: "Auckland",
    timezone: "Pacific/Auckland",
  },
  
  // Africa
  "Africa/Cairo": {
    name: "Eastern European",
    country: "EG",
    city: "Cairo",
    timezone: "Africa/Cairo",
  },
  "Africa/Lagos": {
    name: "West Africa",
    country: "NG",
    city: "Lagos",
    timezone: "Africa/Lagos",
  },
  "Africa/Johannesburg": {
    name: "South Africa",
    country: "ZA",
    city: "Johannesburg",
    timezone: "Africa/Johannesburg",
  },
  "Africa/Casablanca": {
    name: "Western European",
    country: "MA",
    city: "Casablanca",
    timezone: "Africa/Casablanca",
  },
  "Africa/Nairobi": {
    name: "East Africa",
    country: "KE",
    city: "Nairobi",
    timezone: "Africa/Nairobi",
  },
}

export const DEFAULT_COLUMNS = [
  "America/New_York",      // New York
  "America/Chicago",       // Chicago
  "Europe/London",         // London UK
  "UTC",                   // UTC
  "Asia/Dubai",           // Dubai
  "Asia/Kolkata",         // India
  "Australia/Sydney",     // Sydney Australia
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

// Get timezone abbreviation dynamically using multiple Intl API strategies
export const getTimezoneAbbreviation = (date: Date, timezone: string): string => {
  try {
    // Special case for UTC
    if (timezone === "UTC") {
      return "UTC"
    }
    
    // Strategy 1: Try getting the abbreviation using formatToParts
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    })
    
    const parts = formatter.formatToParts(date)
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')
    let abbreviation = timeZoneName?.value
    
    // Strategy 2: If we get a generic abbreviation like "MT", try a different approach
    if (abbreviation && (abbreviation === 'MT' || abbreviation === 'CT' || abbreviation === 'ET' || abbreviation === 'PT')) {
      // Create two dates - one in January (standard time) and one in July (likely daylight time)
      const january = new Date(date.getFullYear(), 0, 15) // Mid January
      const july = new Date(date.getFullYear(), 6, 15) // Mid July
      
      // Get abbreviations for both dates
      const janFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      })
      const julFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      })
      
      const janParts = janFormatter.formatToParts(january)
      const julParts = julFormatter.formatToParts(july)
      
      const janAbbr = janParts.find(part => part.type === 'timeZoneName')?.value
      const julAbbr = julParts.find(part => part.type === 'timeZoneName')?.value
      
      // If we get different abbreviations, use the appropriate one
      if (janAbbr && julAbbr && janAbbr !== julAbbr) {
        // Check if current date is in DST
        const isDST = isDSTActive(date, timezone)
        
        // For most US timezones, July is DST and January is standard
        const isDSTUsuallyActive = isDSTActive(july, timezone)
        const isStandardTime = !isDSTActive(january, timezone)
        
        if (isDSTUsuallyActive && isStandardTime) {
          abbreviation = isDST ? julAbbr : janAbbr
        }
      }
    }
    
    // Strategy 3: For some edge cases, manually construct from timezone if still generic
    if (abbreviation && (abbreviation === 'MT' || abbreviation === 'CT' || abbreviation === 'ET' || abbreviation === 'PT')) {
      const isDST = isDSTActive(date, timezone)
      
      // Map generic abbreviations to proper ones based on timezone
      const timezoneMap: Record<string, { standard: string, daylight: string }> = {
        'America/Denver': { standard: 'MST', daylight: 'MDT' },
        'America/Edmonton': { standard: 'MST', daylight: 'MDT' },
        'America/Chicago': { standard: 'CST', daylight: 'CDT' },
        'America/New_York': { standard: 'EST', daylight: 'EDT' },
        'America/Los_Angeles': { standard: 'PST', daylight: 'PDT' },
      }
      
      const mapping = timezoneMap[timezone]
      if (mapping) {
        abbreviation = isDST ? mapping.daylight : mapping.standard
      }
    }
    
    // Return the best abbreviation we found, excluding GMT+X formats
    if (abbreviation && !abbreviation.startsWith('GMT') && !abbreviation.startsWith('UTC')) {
      return abbreviation
    }
    
    // Final fallback
    return abbreviation || timezone.split('/').pop() || timezone
    
  } catch (error) {
    console.warn(`Error getting timezone abbreviation for ${timezone}:`, error)
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
  // Check if date is valid
  if (!date || isNaN(date.getTime())) {
    return "--:--"
  }
  
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

export const getTimeForTimezone = (baseTime: Date, timezone: string, selectedDate: Date, baseTimezone?: string): Date => {
  try {
    const actualTimezone = getActualTimezone(timezone)
    const actualBaseTimezone = baseTimezone ? getActualTimezone(baseTimezone) : undefined
    
    // If we have a base timezone, we need to convert from base timezone to target timezone
    if (actualBaseTimezone && actualBaseTimezone !== actualTimezone) {
      return convertTimeBetweenTimezones(baseTime, actualBaseTimezone, actualTimezone, selectedDate)
    }
    
    // Original logic for when no base timezone is specified
    // Create a date with the same date as selectedDate but time from baseTime
    const selectedDateTime = new Date(selectedDate)
    selectedDateTime.setHours(baseTime.getHours(), baseTime.getMinutes(), baseTime.getSeconds(), 0)
    
    // Method 1: Use Intl.DateTimeFormat to get the time in the target timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: actualTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    const parts = formatter.formatToParts(selectedDateTime)
    const formatParts: Record<string, string> = {}
    parts.forEach(part => {
      formatParts[part.type] = part.value
    })
    
    // Reconstruct the date in the target timezone
    const timeInTimezone = new Date(
      parseInt(formatParts.year),
      parseInt(formatParts.month) - 1, // Month is 0-indexed
      parseInt(formatParts.day),
      parseInt(formatParts.hour),
      parseInt(formatParts.minute),
      parseInt(formatParts.second)
    )
    
    // Verify the result is valid
    if (!isNaN(timeInTimezone.getTime())) {
      return timeInTimezone
    }
    
    // Method 2: Fallback using offset calculation
    const offset = getTimezoneOffset(selectedDateTime, actualTimezone)
    const utcTime = selectedDateTime.getTime() - (selectedDateTime.getTimezoneOffset() * 60 * 1000)
    const targetTime = new Date(utcTime + (offset * 60 * 60 * 1000))
    
    if (!isNaN(targetTime.getTime())) {
      return targetTime
    }
    
    // Method 3: Final fallback
    return selectedDateTime
    
  } catch (error) {
    console.warn(`Error converting time for timezone ${timezone}:`, error)
    // Return a valid fallback date
    const fallback = new Date(selectedDate)
    fallback.setHours(baseTime.getHours(), baseTime.getMinutes(), baseTime.getSeconds(), 0)
    return fallback
  }
}

// New function to convert time between specific timezones
export const convertTimeBetweenTimezones = (localTime: Date, fromTimezone: string, toTimezone: string, selectedDate: Date): Date => {
  try {
    const actualFromTimezone = getActualTimezone(fromTimezone)
    const actualToTimezone = getActualTimezone(toTimezone)
    
    // Create a date object representing the time in the source timezone on the selected date
    const sourceDateTime = new Date(selectedDate)
    sourceDateTime.setHours(localTime.getHours(), localTime.getMinutes(), localTime.getSeconds(), 0)
    
    // Convert to a string in the source timezone, then parse it as UTC to get the "wall clock" time
    const sourceTimeString = sourceDateTime.toLocaleString('sv-SE', { timeZone: actualFromTimezone })
    const sourceAsUTC = new Date(sourceTimeString + 'Z')
    
    // Get the offset difference between source and target timezones
    const sourceOffset = getTimezoneOffset(sourceDateTime, actualFromTimezone)
    const targetOffset = getTimezoneOffset(sourceDateTime, actualToTimezone)
    const offsetDifferenceMs = (targetOffset - sourceOffset) * 60 * 60 * 1000
    
    // Apply the offset difference
    const targetTime = new Date(sourceAsUTC.getTime() + offsetDifferenceMs)
    
    if (!isNaN(targetTime.getTime())) {
      return targetTime
    }
    
    // Fallback method using Intl.DateTimeFormat
    const baseTimeString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}T${String(localTime.getHours()).padStart(2, '0')}:${String(localTime.getMinutes()).padStart(2, '0')}:${String(localTime.getSeconds()).padStart(2, '0')}`
    
    // Create a date assuming it's in the source timezone
    const baseDate = new Date(baseTimeString)
    
    // Get what this time would be in UTC if it were in the source timezone
    const sourceFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: actualFromTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    // Find the UTC time that, when converted to the source timezone, gives us our desired time
    let testDate = new Date(baseDate.getTime() - (sourceOffset * 60 * 60 * 1000))
    
    // Convert this UTC time to the target timezone
    const targetFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: actualToTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    const targetParts = targetFormatter.formatToParts(testDate)
    const targetFormatParts: Record<string, string> = {}
    targetParts.forEach(part => {
      targetFormatParts[part.type] = part.value
    })
    
    const finalTargetTime = new Date(
      parseInt(targetFormatParts.year),
      parseInt(targetFormatParts.month) - 1,
      parseInt(targetFormatParts.day),
      parseInt(targetFormatParts.hour),
      parseInt(targetFormatParts.minute),
      parseInt(targetFormatParts.second)
    )
    
    return finalTargetTime
    
  } catch (error) {
    console.warn(`Error converting time from ${fromTimezone} to ${toTimezone}:`, error)
    // Return fallback
    const fallback = new Date(selectedDate)
    fallback.setHours(localTime.getHours(), localTime.getMinutes(), localTime.getSeconds(), 0)
    return fallback
  }
}

// Helper function to get the actual timezone for calculations
// Some cities like Calgary use different cities' timezones
export const getActualTimezone = (timezone: string): string => {
  const info = TIMEZONES[timezone]
  return info?.timezone || timezone
}

export const getTimezoneInfo = (timezone: string, selectedDate: Date): ExtendedTimezoneInfo => {
  const info = TIMEZONES[timezone]
  const actualTimezone = getActualTimezone(timezone)
  const isDST = isDSTActive(selectedDate, actualTimezone)
  const offset = getTimezoneOffset(selectedDate, actualTimezone)
  const currentName = getTimezoneAbbreviation(selectedDate, actualTimezone)

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
  
  // Special case for UTC - just return "UTC" without country
  if (timezone === "UTC") {
    return "UTC"
  }
  
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

// Get all cities sorted by region and then by city name
export const getCitiesByRegion = (): Record<string, Array<{ timezone: string; info: TimezoneInfo }>> => {
  const regions: Record<string, Array<{ timezone: string; info: TimezoneInfo }>> = {
    "North America": [],
    "South America": [],
    "Europe": [],
    "Asia": [],
    "Africa": [],
    "Oceania": [],
  }

  Object.entries(TIMEZONES).forEach(([timezone, info]) => {
    const entry = { timezone, info }
    
    if (timezone.startsWith("America/")) {
      if (["US", "CA", "MX"].includes(info.country)) {
        regions["North America"].push(entry)
      } else {
        regions["South America"].push(entry)
      }
    } else if (timezone.startsWith("Europe/")) {
      regions["Europe"].push(entry)
    } else if (timezone.startsWith("Asia/")) {
      regions["Asia"].push(entry)
    } else if (timezone.startsWith("Africa/")) {
      regions["Africa"].push(entry)
    } else if (timezone.startsWith("Australia/") || timezone.startsWith("Pacific/")) {
      regions["Oceania"].push(entry)
    }
  })

  // Sort cities within each region
  Object.keys(regions).forEach(region => {
    regions[region].sort((a, b) => a.info.city.localeCompare(b.info.city))
  })

  return regions
}

// Memoized version with cache for better performance
const citiesByRegionCache = new Map<string, Record<string, Array<{ timezone: string; info: TimezoneInfo }>>>()

export const getCitiesByRegionMemoized = (): Record<string, Array<{ timezone: string; info: TimezoneInfo }>> => {
  const cacheKey = 'regions'
  
  if (citiesByRegionCache.has(cacheKey)) {
    return citiesByRegionCache.get(cacheKey)!
  }
  
  const result = getCitiesByRegion()
  citiesByRegionCache.set(cacheKey, result)
  return result
}

// Cache for timezone info to avoid recalculation
const timezoneInfoCache = new Map<string, ExtendedTimezoneInfo>()

export const getTimezoneInfoMemoized = (timezone: string, selectedDate: Date): ExtendedTimezoneInfo => {
  const dateKey = selectedDate.toDateString()
  const cacheKey = `${timezone}-${dateKey}`
  
  if (timezoneInfoCache.has(cacheKey)) {
    return timezoneInfoCache.get(cacheKey)!
  }
  
  const result = getTimezoneInfo(timezone, selectedDate)
  timezoneInfoCache.set(cacheKey, result)
  
  // Clear old cache entries to prevent memory leaks (keep last 100 entries)
  if (timezoneInfoCache.size > 100) {
    const firstKey = timezoneInfoCache.keys().next().value
    if (firstKey) {
      timezoneInfoCache.delete(firstKey)
    }
  }
  
  return result
}

// Get all cities as a flat sorted list
export const getAllCitiesSorted = (): Array<{ timezone: string; info: TimezoneInfo; regionLabel: string }> => {
  const citiesByRegion = getCitiesByRegionMemoized()
  const allCities: Array<{ timezone: string; info: TimezoneInfo; regionLabel: string }> = []

  Object.entries(citiesByRegion).forEach(([region, cities]) => {
    cities.forEach(city => {
      allCities.push({
        ...city,
        regionLabel: region
      })
    })
  })

  return allCities
}

// Simpler and more reliable timezone conversion function
export const convertTimeToTimezone = (localTime: Date, fromTimezone: string, toTimezone: string, selectedDate: Date): Date => {
  try {
    const actualFromTimezone = getActualTimezone(fromTimezone)
    const actualToTimezone = getActualTimezone(toTimezone)
    
    // If same timezone, return the same time
    if (actualFromTimezone === actualToTimezone) {
      return new Date(localTime)
    }
    
    // Create a date-time string for the selected date and given time
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const hours = String(localTime.getHours()).padStart(2, '0')
    const minutes = String(localTime.getMinutes()).padStart(2, '0')
    const seconds = String(localTime.getSeconds()).padStart(2, '0')
    
    // Create the datetime string in ISO format
    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    
    // Parse it assuming it's in the source timezone
    const tempDate = new Date(dateTimeString)
    
    // Get the time as if it were in the source timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: actualToTimezone,
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    // Calculate the difference in timezone offsets
    const sourceOffset = getTimezoneOffset(tempDate, actualFromTimezone)
    const targetOffset = getTimezoneOffset(tempDate, actualToTimezone)
    const offsetDiffMs = (targetOffset - sourceOffset) * 60 * 60 * 1000
    
    // Apply the offset difference to get the equivalent time in target timezone
    const targetTime = new Date(tempDate.getTime() + offsetDiffMs)
    
    return targetTime
    
  } catch (error) {
    console.warn(`Error converting time from ${fromTimezone} to ${toTimezone}:`, error)
    // Return the original time as fallback
    return new Date(localTime)
  }
}
