'use client'

import { Plus, ChevronDown } from 'lucide-react'
import { useTimeFormat } from '@/components/theme-provider'
import {
	useState,
	useMemo,
	useCallback,
	useDeferredValue,
	useRef,
	useEffect,
} from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
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
	const [isOpen, setIsOpen] = useState(false)
	const deferredSearchQuery = useDeferredValue(searchQuery)
	const inputRef = useRef<HTMLInputElement>(null)

	// Memoize the regions data to avoid recalculating on every render
	const citiesByRegion = useMemo(() => getCitiesByRegionMemoized(), [])

	// Pre-process cities with basic info only (no timezone calculations yet)
	const allCitiesFlat = useMemo(() => {
		return Object.entries(citiesByRegion).flatMap(([region, cities]) =>
			cities.map(({ timezone, info }) => ({
				timezone,
				info,
				region,
				formattedName: getFormattedCityName(timezone),
				searchableText: `${info.city} ${info.country} ${getFormattedCityName(
					timezone
				)} ${timezone}`.toLowerCase(),
			}))
		)
	}, [citiesByRegion])

	// Filter and process cities based on search query
	const filteredRegions = useMemo(() => {
		const query = deferredSearchQuery.toLowerCase().trim()

		let citiesToShowByRegion: Record<string, typeof allCitiesFlat> = {}

		if (!query) {
			// If no search query, show limited cities per region for performance
			allCitiesFlat.forEach((city) => {
				if (!citiesToShowByRegion[city.region]) {
					citiesToShowByRegion[city.region] = []
				}
				if (citiesToShowByRegion[city.region].length < 15) {
					// Limit to 15 cities per region when no search
					citiesToShowByRegion[city.region].push(city)
				}
			})
		} else {
			// Filter cities based on search query - much faster now
			const matchingCities = allCitiesFlat
				.filter((city) => city.searchableText.includes(query))
				.slice(0, 100) // Limit total results to 100 for performance

			matchingCities.forEach((city) => {
				if (!citiesToShowByRegion[city.region]) {
					citiesToShowByRegion[city.region] = []
				}
				citiesToShowByRegion[city.region].push(city)
			})
		}

		// Only now calculate timezone info for cities that will be displayed
		return Object.entries(citiesToShowByRegion)
			.map(([region, cities]) => ({
				region,
				cities: cities.map((city) => {
					const isAlreadyAdded = addedCities.includes(city.timezone)
					const tzInfo = isAlreadyAdded
						? null
						: getTimezoneInfoMemoized(city.timezone, selectedDate)

					return {
						timezone: city.timezone,
						info: city.info,
						isAlreadyAdded,
						formattedName: city.formattedName,
						tzAbbr: tzInfo?.currentName || '',
					}
				}),
			}))
			.filter((region) => region.cities.length > 0)
	}, [allCitiesFlat, addedCities, selectedDate, deferredSearchQuery])

	const handleCitySelect = useCallback(
		(timezone: string) => {
			if (!addedCities.includes(timezone)) {
				onCityAdd(timezone)
				setSearchQuery('') // Clear search after selection
				setIsOpen(false) // Close the popover
			}
		},
		[addedCities, onCityAdd]
	)

	// Focus input when popover opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 100)
		}
	}, [isOpen])

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
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={isOpen}
						className='w-56 justify-between bg-card border-border transition-colors hover:bg-accent hover:text-accent-foreground'
						style={
							{
								borderColor: colorScheme.primary + '40',
								'--tw-ring-color': colorScheme.primary,
							} as React.CSSProperties
						}
					>
						Select a city to add...
						<ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-56 p-0' align='start'>
					<div className='p-2 border-b'>
						<Input
							ref={inputRef}
							placeholder='Search cities...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='h-8'
						/>
					</div>
					<ScrollArea className='max-h-80'>
						{totalCities === 0 && deferredSearchQuery && (
							<div className='px-3 py-2 text-sm text-muted-foreground text-center'>
								No cities found matching "{deferredSearchQuery}"
							</div>
						)}
						{filteredRegions.map(({ region, cities }) => (
							<div key={region} className='px-2 py-1'>
								<div className='text-xs font-semibold text-muted-foreground px-2 py-1 mb-1'>
									{region} {deferredSearchQuery && `(${cities.length})`}
								</div>
								{cities.map(
									({ timezone, formattedName, tzAbbr, isAlreadyAdded }) => (
										<Button
											key={timezone}
											variant='ghost'
											disabled={isAlreadyAdded}
											onClick={() => handleCitySelect(timezone)}
											className={`w-full justify-start h-auto p-2 text-left ${
												isAlreadyAdded ? 'opacity-50' : ''
											}`}
										>
											<div className='flex items-center justify-between w-full'>
												<span className='truncate'>{formattedName}</span>
												{!isAlreadyAdded && tzAbbr && (
													<span className='text-xs text-muted-foreground ml-2 shrink-0'>
														{tzAbbr}
													</span>
												)}
											</div>
										</Button>
									)
								)}
							</div>
						))}
					</ScrollArea>
				</PopoverContent>
			</Popover>
		</div>
	)
}
