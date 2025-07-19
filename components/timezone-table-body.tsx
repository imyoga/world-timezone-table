import {
	DEFAULT_COLUMNS,
	getTimezoneInfo,
	formatTime,
	getGradientClass,
} from '@/lib/timezone-utils'
import { Badge } from '@/components/ui/badge'
import { TimeRow } from '@/hooks/use-time-rows'

interface TimezoneTableBodyProps {
	timeRows: TimeRow[]
	baseTimezone: string
	selectedDate: Date
	timeFormat: '12h' | '24h'
	onRowClick: (rowIndex: number) => void
}

export function TimezoneTableBody({
	timeRows,
	baseTimezone,
	selectedDate,
	timeFormat,
	onRowClick,
}: TimezoneTableBodyProps) {
	return (
		<tbody>
			{timeRows.map((row) => (
				<tr
					key={row.index}
					className={`border-b transition-colors duration-150 cursor-pointer group
						${row.index % 2 === 0 ? 'bg-muted/10' : 'bg-background'}
						${row.isCurrentTime 
							? 'bg-blue-50/60 dark:bg-blue-950/50 border-blue-200/50 dark:border-blue-800/50' 
							: ''
						}
						hover:bg-accent/80 hover:shadow-sm
						${row.isNextDay ? 'border-t-2 border-dashed border-gray-400' : ''}
					`}
					onClick={() => onRowClick(row.index)}
				>
					<td
						className={`p-3 font-medium transition-colors duration-150
							${getGradientClass(row.times[baseTimezone]?.getHours() || 0)}
							group-hover:bg-transparent
						`}
					>
						<div className='flex items-center gap-2'>
							{formatTime(row.times[baseTimezone], timeFormat)}
							{row.isNextDay && (
								<Badge variant='outline' className='text-xs'>
									+1
								</Badge>
							)}
						</div>
					</td>
					{DEFAULT_COLUMNS.filter((tz) => tz !== baseTimezone).map(
						(timezone) => (
							<td
								key={timezone}
								className={`p-3 text-center transition-colors duration-150
									${getGradientClass(row.times[timezone]?.getHours() || 0)}
									group-hover:bg-transparent
								`}
							>
								{formatTime(row.times[timezone], timeFormat)}
							</td>
						)
					)}
				</tr>
			))}
		</tbody>
	)
}
