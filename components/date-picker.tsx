import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'

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
	return (
		<div className='flex items-center gap-2'>
			<Calendar className='h-4 w-4' />
			<span className='text-sm font-medium'>Date:</span>
			<Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className='w-48 justify-start text-left font-normal bg-transparent'
					>
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
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
