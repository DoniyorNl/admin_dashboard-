import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'gradient' | 'outline'
	children: ReactNode
	fullWidth?: boolean
	size?: 'sm' | 'md' | 'lg' | 'icon'
	loading?: boolean
	icon?: ReactNode
	iconPosition?: 'left' | 'right'
}

const variantClasses = {
	primary:
		'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
	secondary:
		'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
	danger:
		'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-500/30 hover:shadow-red-500/50',
	success:
		'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-lg shadow-green-500/30 hover:shadow-green-500/50',
	ghost:
		'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-700',
	gradient:
		'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
	outline:
		'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700',
}

const sizeClasses = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-5 py-3 text-lg',
	icon: 'p-2',
}

const Button = ({
	variant = 'gradient',
	size = 'md',
	fullWidth = false,
	className = '',
	children,
	loading = false,
	disabled = false,
	icon,
	iconPosition = 'left',
	...props
}: ButtonProps) => {
	const baseClasses =
		'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'

	const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
		fullWidth ? 'w-full' : ''
	} ${className}`

	return (
		<button className={buttonClasses} disabled={disabled || loading} {...props}>
			{loading && (
				<svg
					className='animate-spin h-4 w-4'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
				>
					<circle
						className='opacity-25'
						cx='12'
						cy='12'
						r='10'
						stroke='currentColor'
						strokeWidth='4'
					></circle>
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
					></path>
				</svg>
			)}
			{!loading && icon && iconPosition === 'left' && icon}
			{children}
			{!loading && icon && iconPosition === 'right' && icon}
		</button>
	)
}

export default Button
