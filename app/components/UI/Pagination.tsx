import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

interface PaginationProps {
	page: number
	totalPages: number
	setPage: (page: number) => void
}

export function Pagination({ page, totalPages, setPage }: PaginationProps) {
	return (
		<div className='flex items-center gap-2'>
			{/* Previous Button */}
			<Button
				onClick={() => setPage(page - 1)}
				disabled={page === 1}
				variant='outline' // rangsiz
				icon={<ChevronLeft />}
			>
				<span className='hidden sm:inline'>Previous</span>
			</Button>

			{/* Page Numbers */}
			{[...Array(totalPages)].map((_, i) => (
				<Button
					key={i}
					variant={page === i + 1 ? 'gradient' : 'outline'} // faqat raqamlar gradient
					size='icon'
					onClick={() => setPage(i + 1)}
				>
					{i + 1}
				</Button>
			))}

			{/* Next Button */}
			<Button
				onClick={() => setPage(page + 1)}
				disabled={page === totalPages}
				variant='outline' // rangsiz
				icon={<ChevronRight />}
			>
				<span className='hidden sm:inline'>Next</span>
			</Button>
		</div>
	)
}
