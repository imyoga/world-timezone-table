import { Clock } from 'lucide-react'
import { format } from 'date-fns'
import { useTimeFormat } from '@/components/theme-provider'
import {
	formatTime,
	getTimeForTimezone,
	ExtendedTimezoneInfo,
	getFormattedCityName,
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
	const { colorScheme } = useTimeFormat()

	// Show loading state during hydration to avoid mismatch
	if (!isClient) {
		return (
			<div className='flex items-center gap-4 bg-card rounded-lg px-4 py-3 shadow-sm border border-border hover:shadow-md transition-all duration-200 cursor-pointer group'>
				<Clock 
					className='h-6 w-6 group-hover:opacity-80 transition-colors' 
					style={{ color: colorScheme.primary }}
				/>
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
			<Clock 
				className='h-6 w-6 group-hover:opacity-80 transition-colors' 
				style={{ color: colorScheme.primary }}
			/>
			<div className='text-right'>
				<div className='flex items-center justify-end gap-2'>
					<p 
						className='text-lg font-semibold group-hover:opacity-80 transition-all'
						style={{ color: colorScheme.primary }}
					>
						{formatTime(
							getTimeForTimezone(currentTime, baseTimezone, new Date()),
							timeFormat,
							true
						)}
					</p>
					<span 
						className='px-2 py-1 text-xs font-medium rounded-full border transition-colors'
						style={{ 
							backgroundColor: colorScheme.accent,
							color: colorScheme.primary,
							borderColor: colorScheme.primary + '33' // 33 is 20% opacity in hex
						}}
					>
						{timeFormat.toUpperCase()}
					</span>
				</div>
				<p className='text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors'>
					{format(new Date(), 'EEE, MMM d, yyyy')} • {getFormattedCityName(baseTimezone)}{' '}
					{baseTimezoneInfo.currentName}
				</p>
			</div>
		</div>
	)
}
