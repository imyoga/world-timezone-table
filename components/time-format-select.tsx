import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface TimeFormatSelectProps {
	timeFormat: '12h' | '24h'
	onTimeFormatChange: (format: '12h' | '24h') => void
}

export function TimeFormatSelect({
	timeFormat,
	onTimeFormatChange,
}: TimeFormatSelectProps) {
	return (
		<div className='flex items-center gap-3'>
			<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
				<span>Format:</span>
			</div>
			<Select value={timeFormat} onValueChange={onTimeFormatChange}>
				<SelectTrigger className='w-20 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 transition-colors'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='12h'>12h</SelectItem>
					<SelectItem value='24h'>24h</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
