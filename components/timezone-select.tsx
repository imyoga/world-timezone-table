import { Settings } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { TIMEZONES, getTimezoneInfo } from '@/lib/timezone-utils'

interface TimezoneSelectProps {
	baseTimezone: string
	selectedDate: Date
	onBaseTimezoneChange: (timezone: string) => void
}

export function TimezoneSelect({
	baseTimezone,
	selectedDate,
	onBaseTimezoneChange,
}: TimezoneSelectProps) {
	return (
		<div className='flex items-center gap-2'>
			<Settings className='h-4 w-4' />
			<span className='text-sm font-medium'>Base Timezone:</span>
			<Select value={baseTimezone} onValueChange={onBaseTimezoneChange}>
				<SelectTrigger className='w-48'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{Object.entries(TIMEZONES).map(([tz, info]) => {
						const tzInfo = getTimezoneInfo(tz, selectedDate)
						return (
							<SelectItem key={tz} value={tz}>
								{info.country} {tzInfo.currentName} - {info.city}
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>
		</div>
	)
}
