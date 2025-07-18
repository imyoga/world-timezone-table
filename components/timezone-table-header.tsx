import {
	DEFAULT_COLUMNS,
	getTimezoneInfo,
	ExtendedTimezoneInfo,
} from '@/lib/timezone-utils'

interface TimezoneTableHeaderProps {
	baseTimezone: string
	baseTimezoneInfo: ExtendedTimezoneInfo
	selectedDate: Date
}

export function TimezoneTableHeader({
	baseTimezone,
	baseTimezoneInfo,
	selectedDate,
}: TimezoneTableHeaderProps) {
	return (
		<thead>
			<tr className='border-b bg-muted/50'>
				<th className='p-3 text-left font-semibold min-w-32'>
					<div className='flex flex-col items-start gap-1'>
						<span>
							{baseTimezoneInfo.country} {baseTimezoneInfo.currentName}
						</span>
						<span className='text-xs text-muted-foreground'>
							{baseTimezoneInfo.utcOffset}
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
								<span>
									{tzInfo.country} {tzInfo.currentName}
								</span>
								<span className='text-xs text-muted-foreground'>
									{tzInfo.utcOffset}
								</span>
							</div>
						</th>
					)
				})}
			</tr>
		</thead>
	)
}
