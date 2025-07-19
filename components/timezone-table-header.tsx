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
import { TableHeader, TableHead, TableRow } from '@/components/ui/table'

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
		<TableHeader className='sticky top-0 z-20'>
			{/* Main header row with timezone info */}
			<TableRow 
				className='bg-background h-[60px] border-b border-border/50'
				style={{
					position: 'sticky',
					top: 0,
					zIndex: 21
				}}
			>
				<TableHead className='px-4 py-3 text-left font-semibold min-w-32 bg-background text-foreground'>
					<div className='flex flex-col items-start gap-1'>
						<span className='text-foreground'>{getFormattedCityName(baseTimezone)}</span>
						<span className='text-xs text-muted-foreground'>
							{`${baseTimezoneInfo.currentName} (${baseTimezoneInfo.utcOffset})`}
						</span>
					</div>
				</TableHead>
				{otherColumns.map((timezone) => {
					const tzInfo = getTimezoneInfo(timezone, selectedDate)
					return (
						<TableHead
							key={timezone}
							className='px-4 py-3 text-center font-semibold min-w-28 relative group bg-background text-foreground'
						>
							<div className='flex flex-col items-center gap-1'>
								<div className='flex items-center gap-1'>
									<span className='text-foreground'>{getFormattedCityName(timezone)}</span>
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
						</TableHead>
					)
				})}
			</TableRow>

			{/* Current time row - same background as first row with elevated shadow */}
			<TableRow 
				className='bg-background h-[52px] border-b border-border'
				style={{
					position: 'sticky',
					top: '60px',
					zIndex: 20,
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)'
				}}
			>
				<TableHead className='px-4 py-2 text-left font-medium text-sm bg-background h-[52px] text-foreground'>
					<div className='flex flex-col items-start gap-1'>
						<span
							className='font-semibold text-sm'
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
						<span className='text-xs text-muted-foreground/80'>Current Time</span>
					</div>
				</TableHead>
				{otherColumns.map((timezone) => (
					<TableHead
						key={`current-${timezone}`}
						className='px-4 py-2 text-center font-medium text-sm bg-background h-[52px] text-foreground'
					>
						<div className='flex flex-col items-center gap-1'>
							<span
								className='font-semibold text-sm'
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
							<span className='text-xs text-muted-foreground/80'>
								Current Time
							</span>
						</div>
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	)
}
