/**
 * Class strings for the app's controls.
 *
 * Deliberately plain strings rather than components: the story is the design,
 * and a button here is just a button. Restyle controls by editing this file.
 *
 * Note that relief (see `.braille-cell` in index.css) is never used here.
 * Embossing belongs to braille, which really is embossed; controls stay flat
 * and high-contrast so the tactile conceit never costs anyone usability.
 */

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans " +
  "text-base font-bold no-underline transition-colors duration-150 " +
  "min-h-11 px-5 py-2.5 disabled:opacity-50 disabled:pointer-events-none " +
  "[&_svg]:size-5 [&_svg]:shrink-0";

const variants = {
  /* The one thing to do on the page. */
  primary: "bg-poppy text-parchment hover:bg-poppy/90",
  /* Secondary navigation, on the dusk ground. */
  outline:
    "border-2 border-parchment/35 text-parchment hover:border-parchment/70 hover:bg-parchment/10",
  /* Tertiary — going backwards should never compete with going forwards. */
  ghost: "text-muted hover:text-parchment hover:bg-parchment/10",
  /* On a parchment surface rather than the dusk ground. */
  onPaper: "border-2 border-ink/20 text-ink hover:border-ink/45 hover:bg-ink/5",
} as const;

export type ButtonVariant = keyof typeof variants;

export const buttonStyles = (variant: ButtonVariant = "outline") =>
  `${base} ${variants[variant]}`;

export const labelStyles = "block font-sans text-sm font-bold text-ink/75";

export const inputStyles =
  "w-full min-h-11 rounded-lg border-2 border-ink/25 bg-white/60 px-3 py-2 " +
  "font-sans text-lg text-ink placeholder:text-ink/40 " +
  "focus:border-ink/60 focus:outline-none";
