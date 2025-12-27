// dashboard/message/page.tsx
import { safeFetchJson } from 'lib/api'
import MessagesClient from './MessagesClient'

// Try to fetch messages but never let a network failure crash the page.
// `safeFetchJson` returns `null` on timeout/network error/non-ok.
async function getMessages() {
	const data = await safeFetchJson('/messages', 3000)
	if (!data) return { messages: [], apiAvailable: false }
	return { messages: data, apiAvailable: true }
}

export default async function MessagesPage() {
	const { messages, apiAvailable } = await getMessages()
	return <MessagesClient initialMessages={messages} apiAvailable={apiAvailable} />
}
