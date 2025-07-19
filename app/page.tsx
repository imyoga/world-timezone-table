'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TimezoneSelect } from '@/components/timezone-select'
import { DatePicker } from '@/components/date-picker'
import { TimeFormatSelect } from '@/components/time-format-select'
import { CurrentTimeDisplay } from '@/components/current-time-display'
import { TimezoneTableHeader } from '@/components/timezone-table-header'
import { TimezoneTableBody } from '@/components/timezone-table-body'
import { TimezoneModal } from '@/components/timezone-modal'
import { useTimeRows, useCurrentRowIndex } from '@/hooks/use-time-rows'
import { useClientTime } from '@/hooks/use-client-time'
import { getTimezoneInfo, getTimeForTimezone } from '@/lib/timezone-utils'

export default function WorldTimezoneTable() {
	const [baseTimezone, setBaseTimezone] = useState('America/New_York')
	const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h')
	const [selectedRow, setSelectedRow] = useState<number | null>(null)
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [calendarOpen, setCalendarOpen] = useState(false)

	const { isClient, currentTime } = useClientTime()

	const currentRowIndex = useCurrentRowIndex(currentTime, baseTimezone)
	const timeRows = useTimeRows(
		selectedDate,
		currentRowIndex,
		getTimeForTimezone
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

	return (
		<div className='min-h-screen bg-background p-4'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3'>
							<Globe className='h-8 w-8 text-primary' />
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
							onBaseTimezoneChange={setBaseTimezone}
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
					</div>
				</div>

				{/* Table */}
				<Card className='overflow-hidden'>
					<CardContent className='p-0'>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<TimezoneTableHeader
									baseTimezone={baseTimezone}
									baseTimezoneInfo={baseTimezoneInfo}
									selectedDate={selectedDate}
									currentTime={currentTime}
									timeFormat={timeFormat}
									isClient={isClient}
								/>
								<TimezoneTableBody
									timeRows={timeRows}
									baseTimezone={baseTimezone}
									selectedDate={selectedDate}
									timeFormat={timeFormat}
									onRowClick={handleRowClick}
								/>
							</table>
						</div>
					</CardContent>
				</Card>

				{/* Modal */}
				<TimezoneModal
					isOpen={selectedRow !== null}
					onClose={handleModalClose}
					selectedRow={selectedRow}
					timeRows={timeRows}
					selectedDate={selectedDate}
					timeFormat={timeFormat}
				/>
			</div>
		</div>
	)
}
