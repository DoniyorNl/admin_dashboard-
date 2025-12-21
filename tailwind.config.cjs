/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#1D4ED8', // blue
				secondary: '#374151', // gray
				accent: '#065F46', // dark green
				danger: '#EF4444', // red for errors / hover
			},
		},
	},
	plugins: [],
}
