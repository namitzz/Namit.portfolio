/**
 * The buildings that stand at each stop.
 *
 * Drawn in the overworld's fake perspective: a roof seen from above and
 * in front, a face below it carrying door and windows, and a shadow cast
 * on the ground to the same side for every building. That consistent
 * light is most of what makes a flat tile map read as having depth.
 *
 * A building per kind of stop rather than per stop. Eleven bespoke
 * sprites would be eleven things to keep in style with each other; six
 * types, assigned by what a stop actually is, stay coherent and make the
 * map legible — you can tell a campus from an office from a contest hall
 * without reading a label.
 *
 * The institution marks are not here. At this size a shield or a wordmark
 * is a smudge, so they live in the card where they can be seen.
 */

// Explicit per stop, falling back to the entry's kind. Being able to read
// the mapping in one place is worth more than deriving it cleverly.
const BY_ID = {
  leicester: 'university',
  graduation: 'university',
  aston: 'university',
  modelling: 'arena',
  consultancy: 'arena',
  ctf: 'arena',
  consul: 'civic',
  microinternship: 'office',
  classfutures: 'library',
  cloudseven: 'workshop',
  uniwise: 'workshop',
}

export function buildingFor(entry) {
  return (
    BY_ID[entry.id] ||
    (entry.kind === 'education'
      ? 'university'
      : entry.kind === 'award'
        ? 'arena'
        : 'office')
  )
}

/** Every building stands on this footprint, so the town has one scale. */
export const BUILDING_W = 76
export const BUILDING_H = 72

export default function Building({ type, accent, active }) {
  const Shape = SHAPES[type] || SHAPES.office
  return (
    <svg
      width={BUILDING_W}
      height={BUILDING_H}
      viewBox="0 0 76 72"
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* One ground shadow for every building, thrown the same way, so the
          whole town is lit from the same place. */}
      <ellipse
        cx="38"
        cy="66"
        rx={active ? 30 : 26}
        ry={active ? 7.5 : 6.5}
        fill="rgba(20,32,18,0.42)"
      />
      <Shape accent={accent} active={active} />
      {/* A ring of light on the ground when the stop is the one being
          pointed at: the map's own way of saying "here". */}
      {active && (
        <ellipse
          cx="38"
          cy="66"
          rx="33"
          ry="9"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          opacity="0.85"
        />
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */

const WALL = '#E8DCC2'
const WALL_SHADE = '#CBBC9C'
const TRIM = '#8A7355'
const GLASS = '#5C86A8'
const GLASS_LIT = '#7FB3D0'
const DOOR = '#6B4A2E'

/** Roof, front face, door and windows: the parts every one of these has. */
function Body({ roof, roofDark, children }) {
  return (
    <>
      {/* Roof: the top plane, then a darker front edge for thickness. */}
      <polygon points="38,6 70,22 38,32 6,22" fill={roof} />
      <polygon points="6,22 38,32 38,38 6,28" fill={roofDark} />
      <polygon points="70,22 38,32 38,38 70,28" fill={roofDark} />
      {/* Face */}
      <rect x="10" y="32" width="56" height="26" fill={WALL} />
      <rect x="10" y="32" width="56" height="3" fill={WALL_SHADE} />
      <rect x="10" y="55" width="56" height="3" fill={TRIM} />
      {children}
    </>
  )
}

const Win = ({ x, lit }) => (
  <rect x={x} y="39" width="9" height="9" fill={lit ? GLASS_LIT : GLASS} />
)

const SHAPES = {
  university: ({ accent, active }) => (
    <>
      <Body roof="#B8583F" roofDark="#8E4230">
        <rect x="32" y="44" width="12" height="14" fill={DOOR} />
        <Win x="15" lit={active} />
        <Win x="52" lit={active} />
      </Body>
      {/* A tower, which is what tells a campus from a shop at a glance. */}
      <rect x="30" y="0" width="16" height="12" fill={WALL} />
      <polygon points="38,-8 48,2 28,2" fill={accent} />
      <rect x="35" y="4" width="6" height="6" fill={GLASS} />
    </>
  ),

  arena: ({ accent, active }) => (
    <>
      <Body roof="#4F7FA8" roofDark="#3C6180">
        <rect x="30" y="42" width="16" height="16" fill={DOOR} />
        <Win x="15" lit={active} />
        <Win x="52" lit={active} />
      </Body>
      {/* Banners: a contest hall flies them, and they carry the stop's
          own colour without needing a logo. */}
      <rect x="8" y="14" width="4" height="20" fill={accent} />
      <rect x="64" y="14" width="4" height="20" fill={accent} />
      <polygon points="12,14 24,18 12,22" fill={accent} />
      <polygon points="64,14 52,18 64,22" fill={accent} />
    </>
  ),

  office: ({ active }) => (
    <>
      <Body roof="#6E7B86" roofDark="#525E68">
        <rect x="33" y="46" width="10" height="12" fill={DOOR} />
        <Win x="14" lit={active} />
        <Win x="27" lit={false} />
        <Win x="40" lit={active} />
        <Win x="53" lit={false} />
      </Body>
      {/* A second storey, stepped back, so it reads as taller than the
          houses without breaking the shared footprint. */}
      <rect x="20" y="14" width="36" height="10" fill={WALL} />
      <rect x="20" y="14" width="36" height="3" fill={WALL_SHADE} />
      <rect x="26" y="18" width="7" height="5" fill={GLASS} />
      <rect x="43" y="18" width="7" height="5" fill={GLASS} />
    </>
  ),

  library: ({ accent, active }) => (
    <>
      <Body roof="#5E8F52" roofDark="#456B3D">
        <rect x="32" y="44" width="12" height="14" fill={DOOR} />
        <Win x="15" lit={active} />
        <Win x="52" lit={active} />
      </Body>
      {/* Columns: the one silhouette everyone reads as a library. */}
      <rect x="18" y="34" width="4" height="21" fill={WALL_SHADE} />
      <rect x="27" y="34" width="4" height="21" fill={WALL_SHADE} />
      <rect x="45" y="34" width="4" height="21" fill={WALL_SHADE} />
      <rect x="54" y="34" width="4" height="21" fill={WALL_SHADE} />
      <rect x="14" y="29" width="48" height="4" fill={accent} />
    </>
  ),

  workshop: ({ accent, active }) => (
    <>
      <Body roof="#A6743F" roofDark="#7E5730">
        <rect x="31" y="44" width="14" height="14" fill={DOOR} />
        <Win x="16" lit={active} />
        <Win x="51" lit={active} />
      </Body>
      {/* Chimney and sign: a place where something gets made. */}
      <rect x="52" y="8" width="8" height="16" fill={WALL_SHADE} />
      <rect x="51" y="6" width="10" height="4" fill={TRIM} />
      <rect x="30" y="60" width="16" height="6" fill={accent} />
    </>
  ),

  civic: ({ accent, active }) => (
    <>
      <Body roof="#8C6BA8" roofDark="#6B4F82">
        <rect x="32" y="44" width="12" height="14" fill={DOOR} />
        <Win x="15" lit={active} />
        <Win x="52" lit={active} />
      </Body>
      {/* A dome, for the one stop that was a formal civic occasion. */}
      <path d="M26 14 A12 12 0 0 1 50 14 Z" fill={WALL} />
      <rect x="26" y="14" width="24" height="4" fill={WALL_SHADE} />
      <rect x="36" y="2" width="4" height="6" fill={accent} />
    </>
  ),
}
