'use client'

import { Plus, ChevronDown } from 'lucide-react'
import { useTimeFormat } from '@/components/theme-provider'
import { useState, useMemo, useRef, useEffect } from 'react'
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

interface VirtualizedCitySelectorProps {
	selectedDate: Date
	onCityAdd: (timezone: string) => void
	addedCities: string[]
}

const ITEM_HEIGHT = 40 // Height of each item in pixels
const VISIBLE_ITEMS = 8 // Number of items visible at once

export function VirtualizedCitySelector({
	selectedDate,
	onCityAdd,
	addedCities,
}: VirtualizedCitySelectorProps) {
	const { colorScheme } = useTimeFormat()
	const [open, setOpen] = useState(false)
	const [scrollTop, setScrollTop] = useState(0)
	const scrollRef = useRef<HTMLDivElement>(null)

	// Memoize the regions data to avoid recalculating on every render
	const citiesByRegion = useMemo(() => getCitiesByRegionMemoized(), [])

	// Flatten all cities into a single list with section headers
	const flattenedItems = useMemo(() => {
		const items: Array<{
			type: 'header' | 'city'
			region?: string
			timezone?: string
			formattedName?: string
			tzAbbr?: string
			isAlreadyAdded?: boolean
		}> = []

		Object.entries(citiesByRegion).forEach(([region, cities]) => {
			// Add region header
			items.push({ type: 'header', region })

			// Add cities in this region
			cities.forEach(({ timezone, info }) => {
				const isAlreadyAdded = addedCities.includes(timezone)
				const tzInfo = isAlreadyAdded
					? null
					: getTimezoneInfoMemoized(timezone, selectedDate)

				items.push({
					type: 'city',
					timezone,
					formattedName: getFormattedCityName(timezone),
					tzAbbr: tzInfo?.currentName || '',
					isAlreadyAdded,
				})
			})
		})

		return items
	}, [citiesByRegion, addedCities, selectedDate])

	// Calculate which items are visible based on scroll position
	const visibleItems = useMemo(() => {
		const startIndex = Math.floor(scrollTop / ITEM_HEIGHT)
		const endIndex = Math.min(
			startIndex + VISIBLE_ITEMS + 2,
			flattenedItems.length
		)

		return flattenedItems.slice(startIndex, endIndex).map((item, index) => ({
			...item,
			originalIndex: startIndex + index,
		}))
	}, [flattenedItems, scrollTop])

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		setScrollTop(e.currentTarget.scrollTop)
	}

	const handleCitySelect = (timezone: string) => {
		if (!addedCities.includes(timezone)) {
			onCityAdd(timezone)
			setOpen(false)
		}
	}

	const totalHeight = flattenedItems.length * ITEM_HEIGHT
	const offsetY = Math.floor(scrollTop / ITEM_HEIGHT) * ITEM_HEIGHT

	return (
		<div className='flex items-center gap-3'>
			<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
				<Plus className='h-4 w-4' style={{ color: colorScheme.primary }} />
				<span>Add City:</span>
			</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='w-56 justify-between bg-card border-border hover:bg-accent hover:text-accent-foreground'
						style={{
							borderColor: colorScheme.primary + '40',
						}}
					>
						Select a city to add...
						<ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-56 p-0' align='start'>
					<div
						className='relative overflow-hidden'
						style={{ height: VISIBLE_ITEMS * ITEM_HEIGHT }}
					>
						<div
							ref={scrollRef}
							className='absolute inset-0 overflow-auto'
							onScroll={handleScroll}
						>
							<div style={{ height: totalHeight, position: 'relative' }}>
								<div
									style={{
										transform: `translateY(${offsetY}px)`,
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
									}}
								>
									{visibleItems.map((item, index) => (
										<div
											key={`${item.type}-${item.originalIndex}`}
											style={{ height: ITEM_HEIGHT }}
											className='flex items-center'
										>
											{item.type === 'header' ? (
												<div className='px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 w-full'>
													{item.region}
												</div>
											) : (
												<button
													className={`w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center justify-between ${
														item.isAlreadyAdded
															? 'opacity-50 cursor-not-allowed'
															: 'cursor-pointer'
													}`}
													disabled={item.isAlreadyAdded}
													onClick={() =>
														item.timezone && handleCitySelect(item.timezone)
													}
												>
													<span className='text-sm'>{item.formattedName}</span>
													{!item.isAlreadyAdded && item.tzAbbr && (
														<span className='text-xs text-muted-foreground'>
															{item.tzAbbr}
														</span>
													)}
												</button>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
