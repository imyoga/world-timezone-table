'use client'

import { Settings, ChevronDown } from 'lucide-react'
import { useTimeFormat } from '@/components/theme-provider'
import {
	useState,
	useMemo,
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
	const [searchQuery, setSearchQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const deferredSearchQuery = useDeferredValue(searchQuery)
	const inputRef = useRef<HTMLInputElement>(null)

	// Memoize the regions data to avoid recalculating on every render
	const citiesByRegion = useMemo(() => getCitiesByRegionMemoized(), [])

	// Pre-process cities with basic info only
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
			// Filter cities based on search query
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

		// Calculate timezone info for cities that will be displayed
		return Object.entries(citiesToShowByRegion)
			.map(([region, cities]) => ({
				region,
				cities: cities.map((city) => {
					const tzInfo = getTimezoneInfoMemoized(city.timezone, selectedDate)

					return {
						timezone: city.timezone,
						info: city.info,
						formattedName: city.formattedName,
						tzAbbr: tzInfo?.currentName || '',
						isSelected: city.timezone === baseTimezone,
					}
				}),
			}))
			.filter((region) => region.cities.length > 0)
	}, [allCitiesFlat, selectedDate, deferredSearchQuery, baseTimezone])

	const handleTimezoneSelect = (timezone: string) => {
		onBaseTimezoneChange(timezone)
		setSearchQuery('') // Clear search after selection
		setIsOpen(false) // Close the popover
	}

	// Focus input when popover opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 100)
		}
	}, [isOpen])

	// Get the formatted name of the selected timezone
	const selectedTimezoneFormatted = useMemo(
		() => getFormattedCityName(baseTimezone),
		[baseTimezone]
	)

	const totalCities = filteredRegions.reduce(
		(sum, region) => sum + region.cities.length,
		0
	)

	return (
		<div className='flex items-center gap-3'>
			<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
				<Settings className='h-4 w-4' style={{ color: colorScheme.primary }} />
				<span>Base Timezone:</span>
			</div>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={isOpen}
						className='w-64 justify-between bg-card border-border transition-colors hover:bg-accent hover:text-accent-foreground'
						style={
							{
								borderColor: colorScheme.primary + '40',
								'--tw-ring-color': colorScheme.primary,
							} as React.CSSProperties
						}
					>
						<span className='truncate'>{selectedTimezoneFormatted}</span>
						<ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-80 p-0' align='start'>
					<div className='p-2 border-b'>
						<Input
							ref={inputRef}
							placeholder='Search timezones...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='h-8'
						/>
					</div>
					<ScrollArea className='max-h-80 overflow-y-auto'>
						{totalCities === 0 && deferredSearchQuery && (
							<div className='px-3 py-2 text-sm text-muted-foreground text-center'>
								No timezones found matching "{deferredSearchQuery}"
							</div>
						)}
						<div className='pb-2'>
							{filteredRegions.map(({ region, cities }) => (
								<div key={region} className='px-2 py-1'>
									<div className='text-xs font-semibold text-muted-foreground px-2 py-1 mb-1'>
										{region} {deferredSearchQuery && `(${cities.length})`}
									</div>
									{cities.map(
										({ timezone, formattedName, tzAbbr, isSelected }) => (
											<Button
												key={timezone}
												variant='ghost'
												onClick={() => handleTimezoneSelect(timezone)}
												className={`w-full justify-start h-auto p-2 text-left min-h-[2.5rem] ${
													isSelected
														? 'bg-accent text-accent-foreground'
														: ''
												}`}
											>
												<div className='flex items-center justify-between w-full min-w-0'>
													<span className='truncate flex-1 text-sm'>
														{formattedName}
													</span>
													{tzAbbr && (
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
						</div>
					</ScrollArea>
				</PopoverContent>
			</Popover>
		</div>
	)
}
