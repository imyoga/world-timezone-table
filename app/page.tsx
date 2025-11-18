'use client'

import { useState, useCallback } from 'react'
import { Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Table } from '@/components/ui/table'
import { TimezoneSelect } from '@/components/timezone-select'
import { DatePicker } from '@/components/date-picker'
import { TimeFormatSelect } from '@/components/time-format-select'
import { CurrentTimeDisplay } from '@/components/current-time-display'
import { TimezoneTableHeader } from '@/components/timezone-table-header'
import { TimezoneTableBody } from '@/components/timezone-table-body'
import { TimezoneModal } from '@/components/timezone-modal'
import { SearchableCitySelector } from '@/components/searchable-city-selector'
import { useTimeRows, useCurrentRowIndex } from '@/hooks/use-time-rows'
import { useClientTime } from '@/hooks/use-client-time'
import { useTimeFormat } from '@/components/theme-provider'
import {
	getTimezoneInfo,
	getTimeForTimezone,
	DEFAULT_COLUMNS,
} from '@/lib/timezone-utils'

// Function to get the local system timezone
function getLocalTimezone(): string {
	try {
		// Attempt to get the system timezone
		return Intl.DateTimeFormat().resolvedOptions().timeZone
	} catch (error) {
		// Fallback if timezone detection fails
		console.warn('Failed to detect system timezone:', error)
		return 'America/New_York'
	}
}

export default function WorldTimezoneTable() {
	// Initialize with local system timezone
	// Note: This will be 'America/New_York' during SSR, then update on client
	const [baseTimezone, setBaseTimezone] = useState(() => {
		if (typeof window !== 'undefined') {
			return getLocalTimezone()
		}
		return 'America/New_York' // SSR fallback
	})
	const { timeFormat, setTimeFormat, colorScheme } = useTimeFormat()
	const [selectedRow, setSelectedRow] = useState<number | null>(null)
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [calendarOpen, setCalendarOpen] = useState(false)
	const [dynamicColumns, setDynamicColumns] =
		useState<string[]>(DEFAULT_COLUMNS)

	const { isClient, currentTime } = useClientTime()

	const currentRowIndex = useCurrentRowIndex(currentTime, baseTimezone)
	const timeRows = useTimeRows(
		selectedDate,
		currentRowIndex,
		getTimeForTimezone,
		baseTimezone,
		dynamicColumns
	)
	const baseTimezoneInfo = getTimezoneInfo(baseTimezone, selectedDate)

	const handleRowClick = (rowIndex: number) => {
		setSelectedRow(rowIndex)
	}

	const handleModalClose = () => {
		setSelectedRow(null)
	}

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date)
	}

	const handleCalendarOpenChange = (open: boolean) => {
		setCalendarOpen(open)
	}

	const handleTimeFormatToggle = () => {
		setTimeFormat(timeFormat === '12h' ? '24h' : '12h')
	}

	const handleBaseTimezoneChange = useCallback(
		(timezone: string) => {
			setBaseTimezone(timezone)
			// Ensure the new base timezone is in the dynamic columns
			if (!dynamicColumns.includes(timezone)) {
				setDynamicColumns((prev) => [
					timezone,
					...prev.filter((tz) => tz !== timezone),
				])
			}
		},
		[dynamicColumns]
	)

	const handleCityAdd = useCallback(
		(timezone: string) => {
			if (!dynamicColumns.includes(timezone)) {
				setDynamicColumns((prev) => [...prev, timezone])
			}
		},
		[dynamicColumns]
	)

	const handleRemoveColumn = useCallback(
		(timezone: string) => {
			// Don't allow removing the base timezone
			if (timezone === baseTimezone) return

			setDynamicColumns((prev) => prev.filter((tz) => tz !== timezone))
		},
		[baseTimezone]
	)

	return (
		<div className='min-h-screen bg-background p-4'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3'>
							<Globe
								className='h-8 w-8 transition-colors'
								style={{ color: colorScheme.primary }}
							/>
							<h1 className='text-3xl font-bold text-foreground'>
								World Timezone Table
							</h1>
						</div>

						<CurrentTimeDisplay
							currentTime={currentTime}
							baseTimezone={baseTimezone}
							baseTimezoneInfo={baseTimezoneInfo}
							timeFormat={timeFormat}
							onTimeFormatToggle={handleTimeFormatToggle}
							isClient={isClient}
						/>
					</div>

					{/* Controls */}
					<div className='flex flex-wrap gap-6 items-center justify-start'>
						<TimezoneSelect
							baseTimezone={baseTimezone}
							selectedDate={selectedDate}
							onBaseTimezoneChange={handleBaseTimezoneChange}
						/>

						<DatePicker
							selectedDate={selectedDate}
							calendarOpen={calendarOpen}
							onDateSelect={handleDateSelect}
							onCalendarOpenChange={handleCalendarOpenChange}
						/>

						<TimeFormatSelect
							timeFormat={timeFormat}
							onTimeFormatChange={setTimeFormat}
						/>

						<SearchableCitySelector
							selectedDate={selectedDate}
							onCityAdd={handleCityAdd}
							addedCities={dynamicColumns}
						/>
					</div>
				</div>
				{/* Table */}
				<Card className='overflow-visible'>
					<CardContent className='p-0 overflow-hidden'>
						<Table>
							<TimezoneTableHeader
								baseTimezone={baseTimezone}
								baseTimezoneInfo={baseTimezoneInfo}
								selectedDate={selectedDate}
								currentTime={currentTime}
								timeFormat={timeFormat}
								isClient={isClient}
								dynamicColumns={dynamicColumns}
								onRemoveColumn={handleRemoveColumn}
							/>
							<TimezoneTableBody
								timeRows={timeRows}
								baseTimezone={baseTimezone}
								selectedDate={selectedDate}
								timeFormat={timeFormat}
								onRowClick={handleRowClick}
								dynamicColumns={dynamicColumns}
							/>
						</Table>
					</CardContent>
				</Card>{' '}
				{/* Modal */}
				<TimezoneModal
					isOpen={selectedRow !== null}
					onClose={handleModalClose}
					selectedRow={selectedRow}
					timeRows={timeRows}
					selectedDate={selectedDate}
					timeFormat={timeFormat}
					dynamicColumns={dynamicColumns}
				/>
			</div>
		</div>
	)
}
