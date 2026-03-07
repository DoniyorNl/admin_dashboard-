// dashboard/message/page.tsx
import { safeFetchJson } from 'lib/api'
import MessagesClient from './MessagesClient'

export const dynamic = 'force-dynamic'

type Message = {
	id: number
	conversationId: string
	from: string
	to: string
	text: string
	createdAt: string
	read?: boolean
}

// Try to fetch messages but never let a network failure crash the page.
// `safeFetchJson` returns `null` on timeout/network error/non-ok.
async function getMessages(): Promise<{ messages: Message[]; apiAvailable: boolean }> {
	const data = await safeFetchJson<Message[]>('/messages', 3000)
	if (!data || !Array.isArray(data)) return { messages: [], apiAvailable: false }
	return { messages: data, apiAvailable: true }
}

export default async function MessagesPage() {
	const { messages, apiAvailable } = await getMessages()
	return <MessagesClient initialMessages={messages} apiAvailable={apiAvailable} />
}
