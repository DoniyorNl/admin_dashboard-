/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#4F46E5', // indigo-600
				secondary: '#0B1220', // deep slate for contrast
				accent: '#10B981', // emerald-500
				danger: '#EF4444', // red-500
			},
		},
	},
	plugins: [],
}
