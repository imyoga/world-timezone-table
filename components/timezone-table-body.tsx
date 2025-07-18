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
					className={`border-b transition-all duration-200 hover:bg-muted/50 hover:shadow-sm ${
						row.index % 2 === 0 ? 'bg-muted/10' : 'bg-background'
					} ${
						row.isCurrentTime
							? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
							: ''
					}`}
				>
					<td
						className={`p-3 font-medium cursor-pointer ${getGradientClass(
							row.times[baseTimezone]?.getHours() || 0
						)} ${
							row.isNextDay ? 'border-t-2 border-dashed border-gray-400' : ''
						}`}
						onClick={() => onRowClick(row.index)}
					>
						<div className='flex items-center gap-2'>
							{formatTime(row.times[baseTimezone], timeFormat)}
							{row.isCurrentTime && (
								<Badge variant='secondary' className='text-xs'>
									NOW
								</Badge>
							)}
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
								className={`p-3 text-center cursor-pointer ${getGradientClass(
									row.times[timezone]?.getHours() || 0
								)}`}
								onClick={() => onRowClick(row.index)}
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
