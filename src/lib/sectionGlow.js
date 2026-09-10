/**
 * A section's colour, as a glow that touches none of its own edges.
 *
 * Every section used to paint `linear-gradient(180deg, tint 0%, … 100%)`:
 * a tint at the top, fading downward. Stacked one after another that puts
 * a bright band at the head of each section directly beneath the faded
 * tail of the one before, so every boundary read as a seam — a hard
 * restart of colour at a place where nothing is actually happening.
 *
 * A radial glow centred inside the section reaches zero well before it
 * gets near an edge. Sections still carry their own colour, but they
 * hand over to each other on nothing at all, so the joins disappear and
 * the page reads as one surface with warm places in it.
 *
 * `rgb` is the bare triple, so the same hue can be used at several
 * strengths without repeating the colour itself.
 */
export function sectionGlow(rgb, strength = 0.07) {
  return (
    `radial-gradient(88% 58% at 50% 42%, rgba(${rgb},${strength}), ` +
    `rgba(${rgb},${(strength * 0.28).toFixed(4)}) 46%, rgba(${rgb},0) 74%)`
  )
}

/** The two hues the page alternates between. */
export const EMBER = '244,85,42'
export const AMBER = '245,180,71'
