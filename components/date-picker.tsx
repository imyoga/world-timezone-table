'use client'

import { Calendar } from 'lucide-react'
import { useTimeFormat } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DatePickerProps {
	selectedDate: Date
	calendarOpen: boolean
	onDateSelect: (date: Date) => void
	onCalendarOpenChange: (open: boolean) => void
}

export function DatePicker({
	selectedDate,
	calendarOpen,
	onDateSelect,
	onCalendarOpenChange,
}: DatePickerProps) {
	const { colorScheme } = useTimeFormat()
	
	// Calculate a reasonable range for years (10 years before to 10 years after current year)
	const currentYear = new Date().getFullYear()
	const fromYear = currentYear - 10
	const toYear = currentYear + 10

	return (
		<div className='flex items-center gap-2'>
			<span className='text-sm font-medium'>Date:</span>
			<Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className={cn(
							'w-48 justify-start text-left font-normal bg-white',
							!selectedDate && 'text-muted-foreground'
						)}
						style={{
							borderColor: colorScheme.primary + '40',
							'--tw-ring-color': colorScheme.primary
						} as React.CSSProperties}
					>
						<Calendar 
							className='mr-2 h-4 w-4' 
							style={{ color: colorScheme.primary }}
						/>
						{format(selectedDate, 'PPP')}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<CalendarComponent
						mode='single'
						selected={selectedDate}
						onSelect={(date) => {
							if (date) {
								onDateSelect(date)
								onCalendarOpenChange(false)
							}
						}}
						fromYear={fromYear}
						toYear={toYear}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
