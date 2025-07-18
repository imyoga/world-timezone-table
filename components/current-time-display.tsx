import { Clock } from 'lucide-react'
import { format } from 'date-fns'
import {
	formatTime,
	getTimeForTimezone,
	ExtendedTimezoneInfo,
} from '@/lib/timezone-utils'

interface CurrentTimeDisplayProps {
	currentTime: Date
	baseTimezone: string
	baseTimezoneInfo: ExtendedTimezoneInfo
	timeFormat: '12h' | '24h'
}

export function CurrentTimeDisplay({
	currentTime,
	baseTimezone,
	baseTimezoneInfo,
	timeFormat,
}: CurrentTimeDisplayProps) {
	return (
		<div className='flex items-center gap-4 bg-white dark:bg-slate-800 rounded-lg px-4 py-2 shadow-sm border'>
			<Clock className='h-5 w-5 text-blue-600' />
			<div className='text-right'>
				<p className='text-lg font-semibold'>
					{formatTime(
						getTimeForTimezone(currentTime, baseTimezone, new Date()),
						timeFormat
					)}
				</p>
				<p className='text-sm text-muted-foreground'>
					{format(new Date(), 'EEE, MMM d, yyyy')} • {baseTimezoneInfo.country}{' '}
					{baseTimezoneInfo.currentName}
				</p>
			</div>
		</div>
	)
}
