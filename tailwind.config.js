/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			boxShadow: {
				custom: "inset 0 1px 0 var(--tw-custom-shadow-color), inset 0 -1px 0 var(--tw-custom-shadow-color)"
			}
		}
	},
	plugins: []
};
