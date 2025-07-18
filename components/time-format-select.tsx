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
		<div className='flex items-center gap-2'>
			<span className='text-sm font-medium'>Format:</span>
			<Select value={timeFormat} onValueChange={onTimeFormatChange}>
				<SelectTrigger className='w-20'>
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
