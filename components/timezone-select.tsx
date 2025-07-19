import { Settings } from 'lucide-react'
import { useTimeFormat } from '@/components/theme-provider'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { TIMEZONES, getTimezoneInfo, getFormattedCityName } from '@/lib/timezone-utils'

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
	const { colorScheme } = useTimeFormat()

	return (
		<div className='flex items-center gap-3'>
			<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
				<Settings 
					className='h-4 w-4' 
					style={{ color: colorScheme.primary }}
				/>
				<span>Base Timezone:</span>
			</div>
			<Select value={baseTimezone} onValueChange={onBaseTimezoneChange}>
				<SelectTrigger 
					className='w-48 bg-card hover:bg-hover border-border transition-colors'
					style={{ 
						borderColor: colorScheme.primary + '40',
						'--tw-ring-color': colorScheme.primary 
					} as React.CSSProperties}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{Object.entries(TIMEZONES).map(([tz, info]) => {
						const tzInfo = getTimezoneInfo(tz, selectedDate)
						return (
							<SelectItem key={tz} value={tz}>
								{getFormattedCityName(tz)} - {tzInfo.currentName}
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>
		</div>
	)
}
