'use client'

import { Plus } from 'lucide-react'
import { useTimeFormat } from '@/components/theme-provider'
import { useState, useMemo, useCallback } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
	SelectLabel,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
	getCitiesByRegionMemoized,
	getTimezoneInfoMemoized,
	getFormattedCityName,
} from '@/lib/timezone-utils'

interface SearchableCitySelectorProps {
	selectedDate: Date
	onCityAdd: (timezone: string) => void
	addedCities: string[]
}

export function SearchableCitySelector({
	selectedDate,
	onCityAdd,
	addedCities,
}: SearchableCitySelectorProps) {
	const { colorScheme } = useTimeFormat()
	const [searchQuery, setSearchQuery] = useState('')

	// Memoize the regions data to avoid recalculating on every render
	const citiesByRegion = useMemo(() => getCitiesByRegionMemoized(), [])

	// Filter and process cities based on search query
	const filteredRegions = useMemo(() => {
		const query = searchQuery.toLowerCase().trim()

		if (!query) {
			// If no search query, show all regions but limit to first 20 cities per region for performance
			return Object.entries(citiesByRegion)
				.map(([region, cities]) => ({
					region,
					cities: cities.slice(0, 20).map(({ timezone, info }) => {
						const isAlreadyAdded = addedCities.includes(timezone)
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
				.filter((region) => region.cities.length > 0)
		}

		// Filter cities based on search query
		const matchingRegions = Object.entries(citiesByRegion)
			.map(([region, cities]) => {
				const matchingCities = cities
					.filter(({ timezone, info }) => {
						const cityName = info.city.toLowerCase()
						const countryName = info.country.toLowerCase()
						const formattedName = getFormattedCityName(timezone).toLowerCase()

						return (
							cityName.includes(query) ||
							countryName.includes(query) ||
							formattedName.includes(query) ||
							timezone.toLowerCase().includes(query)
						)
					})
					.map(({ timezone, info }) => {
						const isAlreadyAdded = addedCities.includes(timezone)
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
					})

				return {
					region,
					cities: matchingCities,
				}
			})
			.filter((region) => region.cities.length > 0)

		return matchingRegions
	}, [citiesByRegion, addedCities, selectedDate, searchQuery])

	const handleCitySelect = useCallback(
		(timezone: string) => {
			if (!addedCities.includes(timezone)) {
				onCityAdd(timezone)
				setSearchQuery('') // Clear search after selection
			}
		},
		[addedCities, onCityAdd]
	)

	const totalCities = filteredRegions.reduce(
		(sum, region) => sum + region.cities.length,
		0
	)

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
					<div className='px-2 pb-2'>
						<Input
							placeholder='Search cities...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='h-8'
						/>
					</div>
					{totalCities === 0 && searchQuery && (
						<div className='px-3 py-2 text-sm text-muted-foreground text-center'>
							No cities found matching "{searchQuery}"
						</div>
					)}
					{filteredRegions.map(({ region, cities }) => (
						<SelectGroup key={region}>
							<SelectLabel className='text-xs font-semibold text-muted-foreground px-2 py-1'>
								{region} {searchQuery && `(${cities.length})`}
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
											<span className='truncate'>{formattedName}</span>
											{!isAlreadyAdded && tzAbbr && (
												<span className='text-xs text-muted-foreground ml-2 shrink-0'>
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
