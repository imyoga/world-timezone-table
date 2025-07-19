import { Settings } from 'lucide-react'
import { useTimeFormat } from '@/components/theme-provider'
import { useMemo } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
	SelectLabel,
} from '@/components/ui/select'
import {
	getCitiesByRegionMemoized,
	getTimezoneInfoMemoized,
	getFormattedCityName,
} from '@/lib/timezone-utils'

interface TimezoneSelectProps {
	baseTimezone: string
	selectedDate: Date
	onBaseTimezoneChange: (timezone: string) => void
}

export function TimezoneSelect({
	baseTimezone,
	selectedDate,
	onBaseTimezoneChange,
}: TimezoneSelectProps) {
	const { colorScheme } = useTimeFormat()

	// Memoize the regions data to avoid recalculating on every render
	const citiesByRegion = useMemo(() => getCitiesByRegionMemoized(), [])

	// Memoize the processed cities to improve performance
	const processedRegions = useMemo(() => {
		return Object.entries(citiesByRegion).map(([region, cities]) => ({
			region,
			cities: cities.map(({ timezone, info }) => {
				const tzInfo = getTimezoneInfoMemoized(timezone, selectedDate)
				return {
					timezone,
					info,
					formattedName: getFormattedCityName(timezone),
					tzAbbr: tzInfo.currentName,
				}
			}),
		}))
	}, [citiesByRegion, selectedDate])

	return (
		<div className='flex items-center gap-3'>
			<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
				<Settings className='h-4 w-4' style={{ color: colorScheme.primary }} />
				<span>Base Timezone:</span>
			</div>
			<Select value={baseTimezone} onValueChange={onBaseTimezoneChange}>
				<SelectTrigger
					className='w-48 bg-card border-border transition-colors hover:bg-accent hover:text-accent-foreground'
					style={
						{
							borderColor: colorScheme.primary + '40',
							'--tw-ring-color': colorScheme.primary,
						} as React.CSSProperties
					}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className='max-h-96'>
					{processedRegions.map(({ region, cities }) => (
						<SelectGroup key={region}>
							<SelectLabel className='text-xs font-semibold text-muted-foreground px-2 py-1'>
								{region}
							</SelectLabel>
							{cities.map(({ timezone, formattedName, tzAbbr }) => (
								<SelectItem key={timezone} value={timezone}>
									<div className='flex items-center justify-between w-full'>
										<span>{formattedName}</span>
										<span className='text-xs text-muted-foreground ml-2'>
											{tzAbbr}
										</span>
									</div>
								</SelectItem>
							))}
						</SelectGroup>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
