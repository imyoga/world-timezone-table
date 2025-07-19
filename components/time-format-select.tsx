import { useTimeFormat } from '@/components/theme-provider'
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
	const { colorScheme } = useTimeFormat()

	return (
		<div className='flex items-center gap-3'>
			<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
				<span>Format:</span>
			</div>
			<Select value={timeFormat} onValueChange={onTimeFormatChange}>
				<SelectTrigger 
					className='w-20 bg-card border-border transition-colors hover:bg-accent hover:text-accent-foreground'
					style={{ 
						borderColor: colorScheme.primary + '40',
						'--tw-ring-color': colorScheme.primary 
					} as React.CSSProperties}
				>
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
