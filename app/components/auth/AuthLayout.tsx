import { ReactNode } from 'react'

interface AuthLayoutProps {
	children: ReactNode
	title: string
	subtitle: string
	icon: ReactNode
}

export const AuthLayout = ({ children, title, subtitle, icon }: AuthLayoutProps) => (
	<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-1 sm:p-8'>
		<div className='w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all'>
			<div className='bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-1 text-center'>
				<div className='inline-flex bg-white/20 backdrop-blur-md p-4 rounded-full mb-4 shadow-inner'>
					{icon}
				</div>
				<h2 className='text-3xl font-extrabold text-white tracking-tight'>{title}</h2>
				<p className='text-blue-100 mt-1 text-sm opacity-90'>{subtitle}</p>
			</div>
			<div className='p-9'>{children}</div>
		</div>
	</div>
)
