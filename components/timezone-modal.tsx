import { Clock, Copy } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import {
	TIMEZONES,
	getTimezoneInfo,
	formatTime,
	getTimeForTimezone,
	copyToClipboard,
} from '@/lib/timezone-utils'
import { TimeRow } from '@/hooks/use-time-rows'

interface TimezoneModalProps {
	isOpen: boolean
	onClose: () => void
	selectedRow: number | null
	timeRows: TimeRow[]
	selectedDate: Date
	timeFormat: '12h' | '24h'
}

export function TimezoneModal({
	isOpen,
	onClose,
	selectedRow,
	timeRows,
	selectedDate,
	timeFormat,
}: TimezoneModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[80vh] flex flex-col'>
				<DialogHeader className='pb-3'>
					<DialogTitle className='flex items-center gap-2 text-lg'>
						<Clock className='h-4 w-4 text-primary' />
						All Timezones - {format(selectedDate, 'MMM d, yyyy')} • Row {selectedRow !== null ? selectedRow + 1 : ''}
					</DialogTitle>
				</DialogHeader>
				{selectedRow !== null && (
					<div className='flex-1 overflow-hidden'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-3 h-full overflow-y-auto pr-1'>
						{Object.entries(TIMEZONES).map(([timezone, info]) => {
							const time =
								timeRows[selectedRow]?.times[timezone] ||
								getTimeForTimezone(new Date(), timezone, selectedDate)
							const tzInfo = getTimezoneInfo(timezone, selectedDate)
							const timeString = formatTime(time, timeFormat)
							const dateString = time.toLocaleDateString('en-US', {
								weekday: 'short',
								month: 'short',
								day: 'numeric',
							})
							const copyText = `${timeString} ${dateString} ${tzInfo.currentName} (${tzInfo.utcOffset})`

							return (
								<div
									key={timezone}
									className="group bg-card border border-border rounded-md hover:shadow-sm transition-all duration-150"
								>
									<div className="px-3 py-2 flex items-center justify-between">
										{/* Left side - Location info */}
										<div className="flex items-center gap-2 flex-1 min-w-0">
											<span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-medium shrink-0">
												{info.country}
											</span>
											<div className="min-w-0 flex-1">
												<div className="flex items-center gap-1">
													<span className="font-semibold text-sm text-foreground truncate">{info.city}</span>
													{tzInfo.isDST && (
														<span className="bg-muted text-muted-foreground px-1 py-0.5 rounded text-xs shrink-0">
															DST
														</span>
													)}
												</div>
												<p className="text-xs text-muted-foreground truncate">
													{tzInfo.currentName} ({tzInfo.utcOffset})
												</p>
											</div>
										</div>
										
										{/* Center - Time */}
										<div className="text-center mx-3 shrink-0">
											<div className="text-lg font-bold text-foreground">
												{timeString}
											</div>
											<div className="text-xs text-muted-foreground">
												{dateString}
											</div>
										</div>
										
										{/* Right side - Copy button */}
										<button
											onClick={() => copyToClipboard(copyText)}
											className="p-2 hover:bg-muted rounded-md transition-colors shrink-0"
											title="Copy time information"
										>
											<Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
										</button>
									</div>
								</div>
							)
						})}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
