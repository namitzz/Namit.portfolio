/**
 * Small floating Contact button anchored to the bottom-right.
 * Hidden on small screens so it does not crowd mobile layouts.
 */
export default function FloatingContact() {
  return (
    <a
      href="#contact"
      aria-label="Jump to contact section"
      className="glass-strong fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/90 shadow-card transition hover:bg-white/10 hover:text-white md:inline-flex"
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: 'var(--accent)' }}
      />
      Contact
    </a>
  )
}
