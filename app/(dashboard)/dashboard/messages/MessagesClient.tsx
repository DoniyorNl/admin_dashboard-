'use client'
import Composer from '@/components/features/messages/Composer'
import MessagesSidebar from '@/components/features/messages/MessagesSidebar'
import MessageThread from '@/components/features/messages/MessageThread'
import { useMemo, useState } from 'react'

type Message = {
	id: number
	conversationId: string
	from: string
	to: string
	text: string
	createdAt: string
	read?: boolean
}

export default function MessagesClient({
	initialMessages,
	apiAvailable = true,
}: {
	initialMessages: Message[]
	apiAvailable?: boolean
}) {
	const [messages, setMessages] = useState<Message[]>(initialMessages || [])
	const [activeConv, setActiveConv] = useState<string | null>(
		() => messages[0]?.conversationId || null,
	)

	const conversations = useMemo(() => {
		const map = new Map<
			string,
			{ id: string; name: string; lastMessage: string; unread?: number }
		>()
		messages.forEach(m => {
			const existing = map.get(m.conversationId)
			if (!existing) {
				map.set(m.conversationId, {
					id: m.conversationId,
					name: m.conversationId,
					lastMessage: m.text,
					unread: m.read ? 0 : 1,
				})
			} else {
				existing.lastMessage = m.text
				if (!m.read) existing.unread = (existing.unread || 0) + 1
			}
		})
		return Array.from(map.values())
	}, [messages])

	const activeMessages = messages.filter(m => m.conversationId === activeConv)

	const handleSend = async (text: string) => {
		const next: Message = {
			id: Date.now(),
			conversationId: activeConv || 'new-1',
			from: 'You',
			to: 'Them',
			text,
			createdAt: new Date().toISOString(),
			read: true,
		}

		// optimistic UI
		setMessages(prev => [...prev, next])

		// try to persist to backend (fire-and-forget)
		try {
			const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
			await fetch(`${base.replace(/\/$/, '')}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(next),
			})
		} catch (err) {
			// ignore for now
		}
	}

	return (
		<div className='flex flex-col md:flex-row gap-4 h-full'>
			{!apiAvailable && (
				<div className='w-full bg-red-50 dark:bg-red-900 border-l-4 border-red-400 text-red-800 px-4 py-2 mb-2'>
					<strong>API unavailable:</strong> Couldn't reach the mock backend. Messages are shown from
					local state only.
				</div>
			)}
			<div className='md:flex-shrink-0'>
				<MessagesSidebar contacts={conversations} onSelect={id => setActiveConv(id)} />
			</div>

			<div className='flex-1 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col'>
				<div className='p-4 border-b border-slate-200 dark:border-slate-800'>
					<h3 className='font-semibold'>{activeConv || 'No conversation selected'}</h3>
				</div>
				<div className='flex-1 overflow-auto p-2'>
					<MessageThread messages={activeMessages} />
				</div>
				<Composer onSend={handleSend} />
			</div>
		</div>
	)
}
