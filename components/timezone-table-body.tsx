import {
	DEFAULT_COLUMNS,
	getTimezoneInfo,
	formatTime,
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
					className={`border-b border-border transition-colors duration-150 cursor-pointer group
						${row.index % 2 === 0 ? 'bg-table-row-even' : 'bg-table-row-odd'}
						${row.isCurrentTime 
							? 'bg-table-current-time border-table-current-time-border' 
							: ''
						}
						hover:bg-table-row-hover hover:shadow-sm
						${row.isNextDay ? 'border-t-2 border-dashed border-muted-foreground' : ''}
					`}
					onClick={() => onRowClick(row.index)}
				>
					<td className="p-3 font-medium transition-colors duration-150">
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
								className="p-3 text-center transition-colors duration-150"
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
