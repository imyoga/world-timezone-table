import {
	DEFAULT_COLUMNS,
	getTimezoneInfo,
	formatTime,
} from '@/lib/timezone-utils'
import { useTimeFormat } from '@/components/theme-provider'
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
	const { colorScheme } = useTimeFormat()

	return (
		<tbody>
			{timeRows.map((row) => (
				<tr
					key={row.index}
					className={`border-b transition-all duration-200 cursor-pointer group relative
						${row.index % 2 === 0 ? 'bg-table-row-even' : 'bg-table-row-odd'}
						${row.isCurrentTime 
							? 'bg-table-current-time border-table-current-time-border border-l-4 shadow-md ring-1' 
							: 'border-border'
						}
						hover:bg-table-row-hover hover:shadow-sm
						${row.isNextDay ? 'border-t-2 border-dashed border-muted-foreground' : ''}
					`}
					style={row.isCurrentTime ? {
						borderLeftColor: colorScheme.primary,
						'--tw-ring-color': colorScheme.primary + '33', // 33 is 20% opacity
						'--current-time-color': colorScheme.primary
					} as React.CSSProperties : {}}
					onClick={() => onRowClick(row.index)}
				>
					<td className={`p-3 font-medium transition-colors duration-150 ${row.isCurrentTime ? 'font-semibold' : ''}`}>
						<div className='flex items-center gap-2'>
							{row.isCurrentTime && (
								<div 
									className="w-2 h-2 rounded-full animate-pulse shrink-0"
									style={{ backgroundColor: colorScheme.primary }}
								></div>
							)}
							<span 
								className={row.isCurrentTime ? 'font-semibold' : ''}
								style={{ 
									color: row.isCurrentTime ? colorScheme.primary : 'inherit',
									fontWeight: row.isCurrentTime ? '600' : 'inherit'
								}}
							>
								{formatTime(row.times[baseTimezone], timeFormat)}
							</span>
							{row.isNextDay && (
								<Badge variant='outline' className='text-xs'>
									+1
								</Badge>
							)}
							{row.isCurrentTime && (
								<Badge 
									variant='default' 
									className='text-xs border'
									style={{
										backgroundColor: colorScheme.accent,
										color: colorScheme.primary,
										borderColor: colorScheme.primary + '33'
									}}
								>
									NOW
								</Badge>
							)}
						</div>
					</td>
					{DEFAULT_COLUMNS.filter((tz) => tz !== baseTimezone).map(
						(timezone) => (
							<td
								key={timezone}
								className={`p-3 text-center transition-colors duration-150 ${row.isCurrentTime ? 'font-semibold' : ''}`}
								style={{ 
									color: row.isCurrentTime ? colorScheme.primary : 'inherit',
									fontWeight: row.isCurrentTime ? '600' : 'inherit'
								}}
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
