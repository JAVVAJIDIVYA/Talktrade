/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── TalkTrade — Indigo + Amber palette ─────────────
           primary      = vibrant indigo  (all buttons/links)
           primary-dark = deeper indigo   (hover states)
           primary-light= soft indigo tint (backgrounds)
           accent       = warm amber      (highlights/badges)
           ─────────────────────────────────────────────────── */
        primary:          "#6366F1",   /* indigo-500 */
        "primary-dark":   "#4F46E5",   /* indigo-600 */
        "primary-light":  "#EEF2FF",   /* indigo-50  */
        secondary:        "#2B2B2E",   /* near-black */
        "secondary-light":"#6B7280",   /* gray-500   */
        accent:           "#F59E0B",   /* amber-400  */
        "accent-dark":    "#D97706",   /* amber-500  */
        dark:             "#111827",
        light:            "#F9FAFB",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
