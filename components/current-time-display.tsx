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
	onTimeFormatToggle: () => void
	isClient: boolean
}

export function CurrentTimeDisplay({
	currentTime,
	baseTimezone,
	baseTimezoneInfo,
	timeFormat,
	onTimeFormatToggle,
	isClient,
}: CurrentTimeDisplayProps) {
	// Show loading state during hydration to avoid mismatch
	if (!isClient) {
		return (
			<div className='flex items-center gap-4 bg-card rounded-lg px-4 py-3 shadow-sm border border-border hover:shadow-md transition-all duration-200 cursor-pointer group'>
				<Clock className='h-5 w-5 text-primary group-hover:text-primary/80 transition-colors' />
				<div className='text-right'>
					<p className='text-lg font-semibold text-foreground group-hover:text-primary transition-colors'>
						--:--:--
					</p>
					<p className='text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors'>
						Loading...
					</p>
				</div>
			</div>
		)
	}

	return (
		<div
			className='flex items-center gap-4 bg-card rounded-lg px-4 py-3 shadow-sm border border-border hover:shadow-md transition-all duration-200 cursor-pointer group'
			onClick={onTimeFormatToggle}
			role='button'
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					onTimeFormatToggle()
				}
			}}
		>
			<Clock className='h-5 w-5 text-primary group-hover:text-primary/80 transition-colors' />
			<div className='text-right'>
				<p className='text-lg font-semibold text-foreground group-hover:text-primary transition-colors'>
					{formatTime(
						getTimeForTimezone(currentTime, baseTimezone, new Date()),
						timeFormat,
						true
					)}
				</p>
				<p className='text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors'>
					{format(new Date(), 'EEE, MMM d, yyyy')} • {baseTimezoneInfo.country}{' '}
					{baseTimezoneInfo.currentName}
				</p>
			</div>
		</div>
	)
}
