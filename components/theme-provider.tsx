'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

type TimeFormat = '12h' | '24h'

interface TimeFormatContextValue {
  timeFormat: TimeFormat
  setTimeFormat: (format: TimeFormat) => void
  colorScheme: {
    primary: string
    primaryHover: string
    primaryForeground: string
    accent: string
    accentHover: string
  }
}

const TimeFormatContext = React.createContext<TimeFormatContextValue | undefined>(undefined)

export function useTimeFormat() {
  const context = React.useContext(TimeFormatContext)
  if (context === undefined) {
    throw new Error('useTimeFormat must be used within a TimeFormatProvider')
  }
  return context
}

const colorSchemes = {
  '12h': {
    primary: 'hsl(217 91% 60%)', // Blue
    primaryHover: 'hsl(217 91% 50%)',
    primaryForeground: 'hsl(0 0% 100%)',
    accent: 'hsl(217 91% 95%)',
    accentHover: 'hsl(217 91% 90%)',
  },
  '24h': {
    primary: 'hsl(25 95% 53%)', // Orange/Amber
    primaryHover: 'hsl(25 95% 43%)',
    primaryForeground: 'hsl(0 0% 100%)',
    accent: 'hsl(25 95% 95%)',
    accentHover: 'hsl(25 95% 90%)',
  },
} as const

function TimeFormatProvider({ children }: { children: React.ReactNode }) {
  const [timeFormat, setTimeFormat] = React.useState<TimeFormat>('12h')

  const colorScheme = colorSchemes[timeFormat]

  // Apply CSS custom properties when format changes
  React.useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary', colorScheme.primary)
    root.style.setProperty('--primary-hover', colorScheme.primaryHover)
    root.style.setProperty('--primary-foreground', colorScheme.primaryForeground)
    root.style.setProperty('--accent', colorScheme.accent)
    root.style.setProperty('--accent-hover', colorScheme.accentHover)
  }, [colorScheme])

  const value = React.useMemo(
    () => ({
      timeFormat,
      setTimeFormat,
      colorScheme,
    }),
    [timeFormat, colorScheme]
  )

  return (
    <TimeFormatContext.Provider value={value}>
      {children}
    </TimeFormatContext.Provider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TimeFormatProvider>
        {children}
      </TimeFormatProvider>
    </NextThemesProvider>
  )
}
