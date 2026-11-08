type Variant = "primary" | "whatsapp" | "secondary" | "ghost";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-gold to-festival text-brown shadow-[0_10px_30px_rgb(242_140_40/0.35)] hover:from-gold-soft hover:to-gold",
  // Brand-adjacent but kept in the warm palette: WhatsApp green would fight the theme.
  whatsapp:
    "bg-gradient-to-r from-saffron to-festival text-brown shadow-[0_10px_30px_rgb(232_117_24/0.4)] hover:from-festival hover:to-gold",
  secondary: "bg-cream/10 text-cream ring-1 ring-inset ring-cream/20 hover:bg-cream/15 hover:ring-gold/50",
  ghost: "text-cream/80 hover:bg-cream/10 hover:text-cream",
};

export function buttonClass(variant: Variant = "primary"): string {
  return `${base} ${variants[variant]}`;
}
