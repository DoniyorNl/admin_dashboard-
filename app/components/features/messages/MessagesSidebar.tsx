import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'

type Contact = {
	id: string
	name: string
	lastMessage: string
	unread?: number
}

/**
 * MessagesSidebar
 * EN: contact list + search for messages
 * UZ: xabarlar yon paneli (kontaktlar va qidiruv)
 */
export default function MessagesSidebar({
	contacts,
	onSelect,
}: {
	contacts: Contact[]
	onSelect: (id: string) => void
}) {
	return (
		<div className='w-full md:w-80 border-r border-slate-200 dark:border-slate-800 p-4'>
			<div className='mb-3'>
				<Input placeholder='Search conversations...' icon={<svg className='w-4 h-4' />} />
			</div>

			<div className='space-y-2 overflow-auto max-h-[60vh]'>
				{contacts.map(c => (
					<button
						key={c.id}
						onClick={() => onSelect(c.id)}
						className='w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-between'
					>
						<div>
							<div className='font-medium text-slate-800 dark:text-slate-100'>{c.name}</div>
							<div className='text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs'>
								{c.lastMessage}
							</div>
						</div>
						<div className='ml-2'>
							{c.unread ? (
								<span className='bg-red-600 text-white px-2 py-0.5 text-xs rounded'>
									{c.unread}
								</span>
							) : (
								<span className='text-xs text-slate-400'>&nbsp;</span>
							)}
						</div>
					</button>
				))}
			</div>

			<div className='mt-4'>
				<Button fullWidth>New Message</Button>
			</div>
		</div>
	)
}
