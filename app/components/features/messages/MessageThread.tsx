import { useEffect, useRef } from 'react'

type Msg = {
	id: number
	from: string
	text: string
	createdAt: string
}

/**
 * MessageThread
 * EN: Shows a scrollable conversation thread
 * UZ: Suhbat oqimini (scrollable) ko'rsatadi
 */
export default function MessageThread({ messages }: { messages: Msg[] }) {
	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
	}, [messages])

	return (
		<div ref={ref} className='p-4 overflow-auto max-h-[60vh] space-y-3'>
			{messages.map(m => (
				<div key={m.id} className={`flex ${m.from === 'You' ? 'justify-end' : 'justify-start'}`}>
					<div
						className={`${
							m.from === 'You'
								? 'bg-blue-600 text-white'
								: 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100'
						} rounded-lg px-4 py-2 max-w-[70%]`}
					>
						<div className='text-sm'>{m.text}</div>
						<div className='text-xs text-slate-400 mt-1'>
							{new Date(m.createdAt).toLocaleString()}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
