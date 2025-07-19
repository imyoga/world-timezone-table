'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, type DayPickerProps } from 'react-day-picker'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Custom header component with themed dropdowns
function CustomHeader({
	displayMonth,
	goToMonth,
	previousMonth,
	nextMonth,
	fromYear = new Date().getFullYear() - 10,
	toYear = new Date().getFullYear() + 10,
}: any) {
	const currentMonth = displayMonth.getMonth()
	const currentYear = displayMonth.getFullYear()

	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	]

	const years = Array.from(
		{ length: toYear - fromYear + 1 },
		(_, i) => fromYear + i
	)

	const handleMonthChange = (monthIndex: number) => {
		const newDate = new Date(currentYear, monthIndex, 1)
		goToMonth(newDate)
	}

	const handleYearChange = (year: number) => {
		const newDate = new Date(year, currentMonth, 1)
		goToMonth(newDate)
	}

	return (
		<div className="flex justify-center items-center gap-2 pb-4">
			<button
				type="button"
				onClick={() => previousMonth && goToMonth(previousMonth)}
				disabled={!previousMonth}
				className={cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
				)}
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<Select 
				value={currentMonth.toString()} 
				onValueChange={(value) => handleMonthChange(parseInt(value))}
			>
				<SelectTrigger className="w-[130px] h-8">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{months.map((month, index) => (
						<SelectItem key={month} value={index.toString()}>
							{month}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select 
				value={currentYear.toString()} 
				onValueChange={(value) => handleYearChange(parseInt(value))}
			>
				<SelectTrigger className="w-[100px] h-8">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{years.map((year) => (
						<SelectItem key={year} value={year.toString()}>
							{year}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<button
				type="button"
				onClick={() => nextMonth && goToMonth(nextMonth)}
				disabled={!nextMonth}
				className={cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
				)}
			>
				<ChevronRight className="h-4 w-4" />
			</button>
		</div>
	)
}

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	fromYear,
	toYear,
	...props
}: CalendarProps & { fromYear?: number; toYear?: number }) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn('p-3', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
				month: 'space-y-4',
				caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'hidden', // Hide default caption since we're using custom header
				nav: 'hidden', // Hide default navigation since we're using custom header
				table: 'w-full border-collapse space-y-1',
				head_row: 'flex',
				head_cell:
					'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
				row: 'flex w-full mt-2',
				cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
				day: cn(
					buttonVariants({ variant: 'ghost' }),
					'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
				),
				day_range_end: 'day-range-end',
				day_selected:
					'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
				day_today: 'bg-accent text-accent-foreground',
				day_outside:
					'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
				day_disabled: 'text-muted-foreground opacity-50',
				day_range_middle:
					'aria-selected:bg-accent aria-selected:text-accent-foreground',
				day_hidden: 'invisible',
				...classNames,
			}}
			components={{
				Caption: (captionProps) => (
					<CustomHeader 
						{...captionProps} 
						fromYear={fromYear} 
						toYear={toYear} 
					/>
				),
			}}
			{...props}
		/>
	)
}
Calendar.displayName = 'Calendar'

export { Calendar }
