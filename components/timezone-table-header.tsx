import {
	DEFAULT_COLUMNS,
	getTimezoneInfo,
	ExtendedTimezoneInfo,
	formatTime,
	getTimeForTimezone,
} from '@/lib/timezone-utils'

interface TimezoneTableHeaderProps {
	baseTimezone: string
	baseTimezoneInfo: ExtendedTimezoneInfo
	selectedDate: Date
	currentTime?: Date
	timeFormat?: '12h' | '24h'
	isClient?: boolean
}

export function TimezoneTableHeader({
	baseTimezone,
	baseTimezoneInfo,
	selectedDate,
	currentTime = new Date(),
	timeFormat = '12h',
	isClient = true,
}: TimezoneTableHeaderProps) {
	return (
		<thead>
			{/* Main header row with timezone info */}
			<tr className='border-b border-border bg-table-header'>
				<th className='p-3 text-left font-semibold min-w-32'>
					<div className='flex flex-col items-start gap-1'>
						<span>
							{baseTimezoneInfo.country}
						</span>
						<span className='text-xs text-muted-foreground'>
							{`${baseTimezoneInfo.currentName} (${baseTimezoneInfo.utcOffset})`}
						</span>
					</div>
				</th>
				{DEFAULT_COLUMNS.filter((tz) => tz !== baseTimezone).map((timezone) => {
					const tzInfo = getTimezoneInfo(timezone, selectedDate)
					return (
						<th
							key={timezone}
							className='p-3 text-center font-semibold min-w-28'
						>
							<div className='flex flex-col items-center gap-1'>
								<span>{`${tzInfo.city} (${tzInfo.country})`}</span>
								<span className='text-xs text-muted-foreground'>
									{`${tzInfo.currentName} (${tzInfo.utcOffset})`}
								</span>
							</div>
						</th>
					)
				})}
			</tr>
			
			{/* Current time row */}
			<tr className='border-b border-border bg-muted'>
				<th className='p-2 text-left font-medium text-sm'>
					<div className='flex flex-col items-start gap-1'>
						<span className='text-primary font-semibold'>
							{isClient ? formatTime(getTimeForTimezone(currentTime, baseTimezone, new Date()), timeFormat, true) : '--:--:--'}
						</span>
						<span className='text-xs text-muted-foreground'>
							Current Time
						</span>
					</div>
				</th>
				{DEFAULT_COLUMNS.filter((tz) => tz !== baseTimezone).map((timezone) => (
					<th
						key={`current-${timezone}`}
						className='p-2 text-center font-medium text-sm'
					>
						<div className='flex flex-col items-center gap-1'>
							<span className='text-primary font-semibold'>
								{isClient ? formatTime(getTimeForTimezone(currentTime, timezone, new Date()), timeFormat, true) : '--:--:--'}
							</span>
							<span className='text-xs text-muted-foreground'>
								Current Time
							</span>
						</div>
					</th>
				))}
			</tr>
		</thead>
	)
}
