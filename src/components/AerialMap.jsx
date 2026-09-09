/**
 * The aerial ground the route is drawn on.
 *
 * Real satellite imagery, not a drawing of one. Eight Esri World Imagery
 * tiles covering the Midlands between Birmingham and Leicester, laid out
 * as a plain grid of <img> and then pushed a long way back with filters
 * so the route stays the subject.
 *
 * No map library and no map component. The view never pans or zooms, so
 * everything Leaflet or MapLibre would bring exists to solve a problem
 * this does not have; eight images in a CSS grid is the whole thing.
 *
 * No API key and no account. Esri's World Imagery basemap serves these
 * tiles openly, which is what makes it deployable to Vercel without
 * secrets or billing. Attribution is required and is rendered.
 *
 * The tiles are a landscape, not a claim: the stops are not placed at
 * their true coordinates, and nothing here says they are. What the
 * imagery gives is real fields, real roads, real urban grey and a real
 * river, which is what a drawn map cannot fake.
 *
 * If a tile fails, the layer beneath it is a terrain-coloured wash rather
 * than a hole, so the section degrades to something deliberate.
 */

// z=10 over the Birmingham-to-Leicester corridor. Verified to span both:
// west -2.461, east -1.055, north 52.909, south 52.483.
const ZOOM = 10
const TILE_X0 = 505
const TILE_Y0 = 334
const COLS = 4
const ROWS = 2

const tileUrl = (x, y) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${ZOOM}/${y}/${x}`

const tiles = Array.from({ length: COLS * ROWS }, (_, i) => ({
  x: TILE_X0 + (i % COLS),
  y: TILE_Y0 + Math.floor(i / COLS),
}))

export default function AerialMap() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      // Terrain-coloured floor, so a blocked or slow tile server leaves a
      // ground rather than a gap.
      style={{ background: '#12140d' }}
    >
      {/* The imagery. Width-driven and vertically centred: the grid is
          2:1 and the section is wider than that, so it is scaled to the
          full width and cropped top and bottom, which keeps the corridor
          across the middle. */}
      <div
        className="absolute left-0 top-1/2 w-full -translate-y-1/2"
        style={{
          aspectRatio: `${COLS} / ${ROWS}`,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          // Pushed back, but not out. Worked through on the tiles' own
          // average of rgb(83,85,40), the first pass at
          // saturate(.42) brightness(.42) contrast(1.18) under a 0.7 wash
          // landed the ground on about rgb(12,12,10): black, with the
          // imagery paid for and invisible. This settles it near
          // rgb(34,34,27), which still reads as fields and roads and
          // still leaves the cream type at roughly 14:1.
          filter: 'saturate(0.55) brightness(0.72) contrast(1.06)',
        }}
      >
        {tiles.map((t) => (
          <img
            key={`${t.x}-${t.y}`}
            src={tileUrl(t.x, t.y)}
            alt=""
            draggable="false"
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover"
          />
        ))}
      </div>

      {/* Cinematic wash. Warm at the top where the section's own gradient
          starts, sinking to near-black at the bottom so the mobile spine
          and the following section meet a settled ground. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,9,8,0.50) 0%, rgba(10,9,8,0.44) 45%, rgba(10,9,8,0.72) 100%), radial-gradient(120% 90% at 50% 45%, rgba(244,85,42,0.09), transparent 70%)',
        }}
      />

      {/* Vignette, so the imagery has no hard edge against the section. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(115% 130% at 50% 50%, transparent 46%, rgba(10,9,8,0.42) 78%, rgba(10,9,8,0.92) 100%)',
        }}
      />

      {/* A graticule: the only drawn thing on the ground, and it reads as
          an instrument overlay rather than as scenery. */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(244,244,245,0.5) 1px, transparent 1px), linear-gradient(180deg, rgba(244,244,245,0.5) 1px, transparent 1px)',
          backgroundSize: '132px 132px',
          maskImage:
            'radial-gradient(120% 120% at 50% 50%, black 30%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(120% 120% at 50% 50%, black 30%, transparent 72%)',
        }}
      />
    </div>
  )
}

/** Required credit for the imagery. Rendered inside the map frame. */
export function AerialCredit() {
  return (
    <p
      className="pointer-events-none absolute bottom-2 right-3 z-10 font-mono text-[9px] uppercase"
      style={{ color: 'rgba(244,244,245,0.30)', letterSpacing: '0.16em' }}
    >
      Imagery · Esri, Maxar, Earthstar Geographics
    </p>
  )
}
