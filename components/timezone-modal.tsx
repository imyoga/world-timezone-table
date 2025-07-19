'use client'

import { useState } from 'react'
import { Clock, Copy, Check } from 'lucide-react'
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
	getFormattedCityName,
	COUNTRY_FLAGS,
} from '@/lib/timezone-utils'
import { TimeRow } from '@/hooks/use-time-rows'
import { useTimeFormat } from '@/components/theme-provider'

interface TimezoneModalProps {
	isOpen: boolean
	onClose: () => void
	selectedRow: number | null
	timeRows: TimeRow[]
	selectedDate: Date
	timeFormat: '12h' | '24h'
	dynamicColumns: string[]
}

export function TimezoneModal({
	isOpen,
	onClose,
	selectedRow,
	timeRows,
	selectedDate,
	timeFormat,
	dynamicColumns,
}: TimezoneModalProps) {
	const [copiedTimezone, setCopiedTimezone] = useState<string | null>(null)
	const { colorScheme } = useTimeFormat()

	const handleCopy = async (timezone: string, text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedTimezone(timezone)
			setTimeout(() => setCopiedTimezone(null), 2000)
		} catch (err) {
			console.error('Failed to copy text: ', err)
		}
	}
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[80vh] flex flex-col overflow-hidden'>
				<DialogHeader className='pb-3 shrink-0'>
					<DialogTitle className='flex items-center gap-2 text-lg'>
						<Clock className='h-4 w-4' style={{ color: colorScheme.primary }} />
						All Timezones - {format(selectedDate, 'MMM d, yyyy')} • Row{' '}
						{selectedRow !== null ? selectedRow + 1 : ''}
					</DialogTitle>
				</DialogHeader>
				{selectedRow !== null && (
					<div className='flex-1 overflow-hidden px-0'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-2 h-full overflow-y-auto overflow-x-hidden'>
							{dynamicColumns.map((timezone) => {
								const info = TIMEZONES[timezone]
								if (!info) return null

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
										className='group bg-card border border-border rounded-md hover:shadow-sm transition-all duration-150 min-w-0'
									>
										<div className='px-2 py-2 flex items-center gap-2 min-w-0'>
											{/* Left side - Location info */}
											<div className='flex-1 min-w-0'>
												<div className='flex items-center gap-1 mb-1'>
													<span className='font-semibold text-sm text-foreground truncate'>
														{getFormattedCityName(timezone)}
													</span>
													{tzInfo.isDST && (
														<span className='bg-muted text-muted-foreground px-1 py-0.5 rounded text-xs shrink-0'>
															DST
														</span>
													)}
												</div>
												<p className='text-xs text-muted-foreground truncate'>
													{tzInfo.currentName} ({tzInfo.utcOffset})
												</p>
											</div>

											{/* Right side - Time and Copy */}
											<div className='flex items-center gap-2 shrink-0'>
												<div className='text-right'>
													<div className='text-sm font-bold text-foreground whitespace-nowrap'>
														{timeString}
													</div>
													<div className='text-xs text-muted-foreground'>
														{dateString}
													</div>
												</div>

												{/* Copy button */}
												<button
													onClick={() => handleCopy(timezone, copyText)}
													className={`p-1.5 rounded-md transition-all duration-200 shrink-0 relative group ${
														copiedTimezone === timezone
															? ''
															: 'hover:bg-muted text-muted-foreground hover:text-foreground'
													}`}
													style={
														copiedTimezone === timezone
															? {
																	backgroundColor: colorScheme.accent,
																	color: colorScheme.primary,
															  }
															: {}
													}
													title={
														copiedTimezone === timezone
															? 'Copied to clipboard!'
															: 'Copy time information'
													}
												>
													{copiedTimezone === timezone ? (
														<Check className='h-3 w-3' />
													) : (
														<Copy className='h-3 w-3' />
													)}

													{/* Tooltip */}
													<div
														className={`absolute bottom-full right-0 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md border border-border transition-all duration-200 whitespace-nowrap z-10 ${
															copiedTimezone === timezone
																? 'opacity-100 translate-y-0'
																: 'opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0'
														}`}
													>
														{copiedTimezone === timezone ? 'Copied!' : 'Copy'}
														<div className='absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-border'></div>
													</div>
												</button>
											</div>
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
