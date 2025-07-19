'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { DayPicker, type DayPickerProps, useDayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Custom dropdown component
interface CustomDropdownProps {
	value: string
	options: { value: string; label: string }[]
	onSelect: (value: string) => void
	className?: string
	placeholder?: string
}

function CustomDropdown({ value, options, onSelect, className, placeholder }: CustomDropdownProps) {
	const [isOpen, setIsOpen] = React.useState(false)
	const dropdownRef = React.useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	const selectedOption = options.find(opt => opt.value === value)

	return (
		<div ref={dropdownRef} className={cn("relative", className)}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
					className
				)}
			>
				<span>{selectedOption?.label || placeholder}</span>
				<ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
			</button>
			
			{isOpen && (
				<div className="absolute top-full mt-1 z-[9999] w-full max-h-[200px] overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onSelect(option.value)
								setIsOpen(false)
							}}
							className={cn(
								"relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none border border-transparent hover:border-primary/20 hover:bg-accent/80 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-all duration-150 ease-in-out hover:shadow-sm",
								value === option.value && "bg-accent text-accent-foreground"
							)}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

// Custom header component with custom dropdowns
function CustomHeader({
	displayMonth,
	fromYear = new Date().getFullYear() - 10,
	toYear = new Date().getFullYear() + 10,
}: {
	displayMonth: Date
	fromYear?: number
	toYear?: number
}) {
	const { goToMonth, previousMonth, nextMonth } = useDayPicker()
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

	const monthOptions = months.map((month, index) => ({
		value: index.toString(),
		label: month
	}))

	const yearOptions = years.map(year => ({
		value: year.toString(),
		label: year.toString()
	}))

	const handleMonthChange = (monthIndex: string) => {
		const newDate = new Date(currentYear, parseInt(monthIndex), 1)
		goToMonth(newDate)
	}

	const handleYearChange = (year: string) => {
		const newDate = new Date(parseInt(year), currentMonth, 1)
		goToMonth(newDate)
	}

	const goToPreviousMonth = () => {
		if (previousMonth) {
			goToMonth(previousMonth)
		}
	}

	const goToNextMonth = () => {
		if (nextMonth) {
			goToMonth(nextMonth)
		}
	}

	return (
		<div className="flex justify-center items-center gap-2 pb-4">
			<button
				type="button"
				onClick={goToPreviousMonth}
				disabled={!previousMonth}
				className={cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
				)}
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<CustomDropdown
				value={currentMonth.toString()}
				options={monthOptions}
				onSelect={handleMonthChange}
				className="w-[130px]"
			/>

			<CustomDropdown
				value={currentYear.toString()}
				options={yearOptions}
				onSelect={handleYearChange}
				className="w-[100px]"
			/>

			<button
				type="button"
				onClick={goToNextMonth}
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
				Caption: ({ displayMonth }) => (
					<CustomHeader 
						displayMonth={displayMonth}
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
