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
	getGradientClass,
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
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Clock className='h-5 w-5' />
						All Timezones for {format(selectedDate, 'MMM d, yyyy')} - Row{' '}
						{selectedRow !== null ? selectedRow + 1 : ''}
					</DialogTitle>
				</DialogHeader>
				{selectedRow !== null && (
					<div className='grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto'>
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
									className={`p-3 rounded-lg ${getGradientClass(
										time.getHours()
									)} relative group`}
								>
									<button
										onClick={() => copyToClipboard(copyText)}
										className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/80 rounded p-1 hover:bg-white dark:hover:bg-black'
										title='Copy time'
									>
										<Copy className='h-3 w-3' />
									</button>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<span className='text-sm font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs'>
												{info.country}
											</span>
											<div>
												<p className='font-semibold text-sm'>{info.city}</p>
												<p className='text-xs text-muted-foreground'>
													{tzInfo.currentName} ({tzInfo.utcOffset})
													{tzInfo.isDST && (
														<span className='ml-1 text-orange-600'>DST</span>
													)}
												</p>
											</div>
										</div>
										<div className='text-right'>
											<p className='text-lg font-bold'>{timeString}</p>
											<p className='text-xs text-muted-foreground'>
												{dateString}
											</p>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
