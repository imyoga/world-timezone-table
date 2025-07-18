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
		<div className='flex items-center gap-3'>
			<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
				<Settings className='h-4 w-4' />
				<span>Base Timezone:</span>
			</div>
			<Select value={baseTimezone} onValueChange={onBaseTimezoneChange}>
				<SelectTrigger className='w-48 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 transition-colors'>
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
