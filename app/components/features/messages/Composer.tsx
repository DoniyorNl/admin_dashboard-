'use client'
import Button from '@/components/UI/Button'
import { useState } from 'react'

export default function Composer({ onSend }: { onSend: (text: string) => void }) {
	const [text, setText] = useState('')

	const send = () => {
		if (!text.trim()) return
		onSend(text.trim())
		setText('')
	}

	return (
		<div className='p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 items-end'>
			<textarea
				value={text}
				onChange={e => setText(e.target.value)}
				placeholder='Write a message...'
				className='flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none'
				rows={2}
			/>
			<div className='flex-shrink-0'>
				<Button onClick={send}>Send</Button>
			</div>
		</div>
	)
}
