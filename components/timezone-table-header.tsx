import {
	getTimezoneInfo,
	ExtendedTimezoneInfo,
	formatTime,
	getTimeForTimezone,
	getFormattedCityName,
} from '@/lib/timezone-utils'
import { useTimeFormat } from '@/components/theme-provider'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TimezoneTableHeaderProps {
	baseTimezone: string
	baseTimezoneInfo: ExtendedTimezoneInfo
	selectedDate: Date
	currentTime?: Date
	timeFormat?: '12h' | '24h'
	isClient?: boolean
	dynamicColumns: string[]
	onRemoveColumn?: (timezone: string) => void
}

export function TimezoneTableHeader({
	baseTimezone,
	baseTimezoneInfo,
	selectedDate,
	currentTime = new Date(),
	timeFormat = '12h',
	isClient = true,
	dynamicColumns,
	onRemoveColumn,
}: TimezoneTableHeaderProps) {
	const { colorScheme } = useTimeFormat()

	const otherColumns = dynamicColumns.filter((tz) => tz !== baseTimezone)

	return (
		<thead>
			{/* Main header row with timezone info */}
			<tr className='border-b border-border bg-table-header'>
				<th className='p-3 text-left font-semibold min-w-32'>
					<div className='flex flex-col items-start gap-1'>
						<span>{getFormattedCityName(baseTimezone)}</span>
						<span className='text-xs text-muted-foreground'>
							{`${baseTimezoneInfo.currentName} (${baseTimezoneInfo.utcOffset})`}
						</span>
					</div>
				</th>
				{otherColumns.map((timezone) => {
					const tzInfo = getTimezoneInfo(timezone, selectedDate)
					return (
						<th
							key={timezone}
							className='p-3 text-center font-semibold min-w-28 relative group'
						>
							<div className='flex flex-col items-center gap-1'>
								<div className='flex items-center gap-1'>
									<span>{getFormattedCityName(timezone)}</span>
									{onRemoveColumn && (
										<Button
											size='sm'
											variant='ghost'
											className='h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground'
											onClick={() => onRemoveColumn(timezone)}
										>
											<X className='h-3 w-3' />
										</Button>
									)}
								</div>
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
						<span
							className='font-semibold'
							style={{ color: colorScheme.primary }}
						>
							{isClient
								? formatTime(
										getTimeForTimezone(currentTime, baseTimezone, new Date()),
										timeFormat,
										true
								  )
								: '--:--:--'}
						</span>
						<span className='text-xs text-muted-foreground'>Current Time</span>
					</div>
				</th>
				{otherColumns.map((timezone) => (
					<th
						key={`current-${timezone}`}
						className='p-2 text-center font-medium text-sm'
					>
						<div className='flex flex-col items-center gap-1'>
							<span
								className='font-semibold'
								style={{ color: colorScheme.primary }}
							>
								{isClient
									? formatTime(
											getTimeForTimezone(currentTime, timezone, new Date()),
											timeFormat,
											true
									  )
									: '--:--:--'}
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
