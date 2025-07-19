'use client'

import { Calendar, ChevronDown } from 'lucide-react'
import { useTimeFormat } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

interface DatePickerProps {
	selectedDate: Date
	calendarOpen: boolean
	onDateSelect: (date: Date) => void
	onCalendarOpenChange: (open: boolean) => void
}

// Simple dropdown component
interface DropdownProps {
	value: string | number
	options: { value: string | number; label: string }[]
	onSelect: (value: string | number) => void
	className?: string
}

function SimpleDropdown({ value, options, onSelect, className }: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
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

	const selectedOption = options.find(opt => opt.value.toString() === value.toString())

	return (
		<div ref={dropdownRef} className={cn("relative", className)}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<span>{selectedOption?.label}</span>
				<ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
			</button>
			
			{isOpen && (
				<div className="absolute top-full mt-1 z-50 w-full max-h-[200px] overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onSelect(option.value)
								setIsOpen(false)
							}}
							className={cn(
								"relative flex w-full cursor-pointer select-none items-center px-2 py-1.5 text-sm outline-none border border-transparent hover:border-primary/20 hover:bg-accent/80 hover:text-accent-foreground transition-all duration-150 ease-in-out hover:shadow-sm",
								value.toString() === option.value.toString() && "bg-accent text-accent-foreground"
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

// Simple calendar grid component
function SimpleCalendar({ 
	selectedDate, 
	onDateSelect, 
	displayMonth, 
	onMonthChange 
}: {
	selectedDate: Date
	onDateSelect: (date: Date) => void
	displayMonth: Date
	onMonthChange: (date: Date) => void
}) {
	const year = displayMonth.getFullYear()
	const month = displayMonth.getMonth()
	
	// Get first day of the month and how many days in the month
	const firstDay = new Date(year, month, 1)
	const lastDay = new Date(year, month + 1, 0)
	const daysInMonth = lastDay.getDate()
	const startingDayOfWeek = firstDay.getDay() // 0 = Sunday
	
	// Generate calendar days
	const days = []
	
	// Add empty cells for days before the first day of the month
	for (let i = 0; i < startingDayOfWeek; i++) {
		days.push(null)
	}
	
	// Add all days of the month
	for (let day = 1; day <= daysInMonth; day++) {
		days.push(day)
	}
	
	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	]
	
	const currentYear = new Date().getFullYear()
	const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
	
	const monthOptions = months.map((monthName, index) => ({
		value: index,
		label: monthName
	}))
	
	const yearOptions = years.map(yearValue => ({
		value: yearValue,
		label: yearValue.toString()
	}))
	
	const handleMonthSelect = (newMonth: string | number) => {
		const newDate = new Date(year, Number(newMonth), 1)
		onMonthChange(newDate)
	}
	
	const handleYearSelect = (newYear: string | number) => {
		const newDate = new Date(Number(newYear), month, 1)
		onMonthChange(newDate)
	}
	
	const isToday = (day: number) => {
		const today = new Date()
		return today.getFullYear() === year && 
			   today.getMonth() === month && 
			   today.getDate() === day
	}
	
	const isSelected = (day: number) => {
		return selectedDate.getFullYear() === year && 
			   selectedDate.getMonth() === month && 
			   selectedDate.getDate() === day
	}

	const handleTodayClick = () => {
		const today = new Date()
		onDateSelect(today)
		onMonthChange(today)
	}

	return (
		<div className="p-3 w-[300px]">
			{/* Header with month/year dropdowns */}
			<div className="flex items-center gap-2 mb-4">
				<SimpleDropdown
					value={month}
					options={monthOptions}
					onSelect={handleMonthSelect}
					className="flex-1"
				/>
				<SimpleDropdown
					value={year}
					options={yearOptions}
					onSelect={handleYearSelect}
					className="w-20"
				/>
			</div>
			
			{/* Calendar grid */}
			<div className="grid grid-cols-7 gap-1 text-center">
				{/* Day headers */}
				{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
					<div key={day} className="text-xs font-medium text-muted-foreground p-2">
						{day}
					</div>
				))}
				
				{/* Calendar days */}
				{days.map((day, index) => (
					<div key={index} className="aspect-square">
						{day && (
							<button
								type="button"
								onClick={() => {
									const newDate = new Date(year, month, day)
									onDateSelect(newDate)
								}}
								className={cn(
									"w-full h-full text-sm rounded-md border border-transparent hover:border-primary/20 hover:bg-accent/80 hover:text-accent-foreground transition-all duration-150 ease-in-out hover:shadow-sm",
									isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary border-primary/30",
									isToday(day) && !isSelected(day) && "bg-accent text-accent-foreground"
								)}
							>
								{day}
							</button>
						)}
					</div>
				))}
			</div>
			
			{/* Today button */}
			<div className="mt-3 pt-3 border-t border-border">
				<button
					type="button"
					onClick={handleTodayClick}
					className="w-full px-3 py-1.5 text-sm font-medium rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
				>
					Today
				</button>
			</div>
		</div>
	)
}

export function DatePicker({
	selectedDate,
	calendarOpen,
	onDateSelect,
	onCalendarOpenChange,
}: DatePickerProps) {
	const { colorScheme } = useTimeFormat()
	const [displayMonth, setDisplayMonth] = useState(selectedDate)

	// Update display month when selected date changes
	useEffect(() => {
		setDisplayMonth(selectedDate)
	}, [selectedDate])

	const handleDateSelect = (date: Date) => {
		onDateSelect(date)
		onCalendarOpenChange(false)
	}

	return (
		<div className='flex items-center gap-2'>
			<span className='text-sm font-medium'>Date:</span>
			<Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className={cn(
							'w-48 justify-start text-left font-normal bg-background transition-colors hover:bg-accent hover:text-accent-foreground',
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
				<PopoverContent 
					className='w-auto p-0' 
					align='start'
				>
					<SimpleCalendar
						selectedDate={selectedDate}
						onDateSelect={handleDateSelect}
						displayMonth={displayMonth}
						onMonthChange={setDisplayMonth}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
