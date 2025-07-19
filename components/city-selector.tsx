'use client'

import { Plus } from 'lucide-react'
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

interface CitySelectorProps {
	selectedDate: Date
	onCityAdd: (timezone: string) => void
	addedCities: string[]
}

export function CitySelector({
	selectedDate,
	onCityAdd,
	addedCities,
}: CitySelectorProps) {
	const { colorScheme } = useTimeFormat()

	// Memoize the regions data to avoid recalculating on every render
	const citiesByRegion = useMemo(() => getCitiesByRegionMemoized(), [])

	// Memoize the filtered and processed cities to improve performance
	const processedRegions = useMemo(() => {
		return Object.entries(citiesByRegion).map(([region, cities]) => ({
			region,
			cities: cities.map(({ timezone, info }) => {
				const isAlreadyAdded = addedCities.includes(timezone)
				// Only calculate timezone info for cities that aren't already added
				// This reduces unnecessary calculations
				const tzInfo = isAlreadyAdded
					? null
					: getTimezoneInfoMemoized(timezone, selectedDate)

				return {
					timezone,
					info,
					isAlreadyAdded,
					formattedName: getFormattedCityName(timezone),
					tzAbbr: tzInfo?.currentName || '',
				}
			}),
		}))
	}, [citiesByRegion, addedCities, selectedDate])

	const handleCitySelect = (timezone: string) => {
		if (!addedCities.includes(timezone)) {
			onCityAdd(timezone)
		}
	}

	return (
		<div className='flex items-center gap-3'>
			<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
				<Plus className='h-4 w-4' style={{ color: colorScheme.primary }} />
				<span>Add City:</span>
			</div>
			<Select value='' onValueChange={handleCitySelect}>
				<SelectTrigger
					className='w-56 bg-card border-border transition-colors hover:bg-accent hover:text-accent-foreground'
					style={
						{
							borderColor: colorScheme.primary + '40',
							'--tw-ring-color': colorScheme.primary,
						} as React.CSSProperties
					}
				>
					<SelectValue placeholder='Select a city to add...' />
				</SelectTrigger>
				<SelectContent className='max-h-96'>
					{processedRegions.map(({ region, cities }) => (
						<SelectGroup key={region}>
							<SelectLabel className='text-xs font-semibold text-muted-foreground px-2 py-1'>
								{region}
							</SelectLabel>
							{cities.map(
								({ timezone, formattedName, tzAbbr, isAlreadyAdded }) => (
									<SelectItem
										key={timezone}
										value={timezone}
										disabled={isAlreadyAdded}
										className={isAlreadyAdded ? 'opacity-50' : ''}
									>
										<div className='flex items-center justify-between w-full'>
											<span>{formattedName}</span>
											{!isAlreadyAdded && tzAbbr && (
												<span className='text-xs text-muted-foreground ml-2'>
													{tzAbbr}
												</span>
											)}
										</div>
									</SelectItem>
								)
							)}
						</SelectGroup>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
