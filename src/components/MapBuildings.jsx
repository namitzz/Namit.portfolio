/**
 * The buildings that stand at each stop.
 *
 * Drawn the way an overworld draws them: a pitched roof seen from high in
 * front, so it is a trapezoid with a ridge along the top and eaves that
 * overhang the wall, then a wall carrying framed windows and a doorway
 * with a step, then a plinth on the ground.
 *
 * The first version used a flat rhombus for the roof, which reads as a
 * kite rather than a roof, because a rhombus has no ridge and no
 * overhang. Those two things are what make a roof legible from above.
 *
 * A building per kind of stop rather than per stop. Eleven bespoke
 * sprites would be eleven things to keep in style with each other; six
 * types, assigned by what a stop actually is, stay coherent and let you
 * tell a campus from an office from a contest hall without a label.
 *
 * The institution marks are not here. At this size a shield is a smudge,
 * so they live in the card where they can be seen.
 */

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

export const BUILDING_W = 96
export const BUILDING_H = 100

const WALL = '#EDE2CA'
const WALL_SHADE = '#CFC0A0'
const WALL_DEEP = '#B0A084'
const PLINTH = '#8E7C5E'
const FRAME = '#7A6244'
const GLASS = '#4E7EA6'
const GLASS_LIT = '#8FC4E0'
const DOOR = '#6A4728'
const DOOR_DARK = '#4E331B'
const EAVE = 'rgba(60,44,28,0.35)'

export default function Building({ type, accent, active }) {
  const spec = SPECS[type] || SPECS.office
  return (
    <svg
      width={BUILDING_W}
      height={BUILDING_H}
      viewBox="0 0 96 100"
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
      shapeRendering="crispEdges"
    >
      {/* One shadow, thrown the same way for every building, so the town
          is lit from a single place. */}
      <ellipse
        cx="48"
        cy="93"
        rx={active ? 36 : 32}
        ry={active ? 8.5 : 7.5}
        fill="rgba(22,36,20,0.45)"
      />
      <Shell spec={spec} accent={accent} active={active} />
      {active && (
        <ellipse
          cx="48"
          cy="93"
          rx="40"
          ry="10.5"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          opacity="0.9"
        />
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */

/** Roof, wall, openings and plinth: the parts every building shares. */
function Shell({ spec, accent, active }) {
  const { roof, roofDark, roofLite, crown, windows, door } = spec
  return (
    <>
      {crown ? crown(accent, active) : null}

      {/* Roof. A trapezoid with the ridge along the top and the eaves
          wider than the wall, which is the overhang that tells you it is
          a roof and not a wall panel. */}
      <polygon points="24,20 72,20 86,44 10,44" fill={roof} />
      {/* Shingle courses. Three lines is enough to read as a tiled roof
          and few enough to stay pixel-clean at this size. */}
      <polygon points="20,32 76,32 78,36 18,36" fill={roofDark} opacity="0.55" />
      <polygon points="14,40 82,40 83,43 13,43" fill={roofDark} opacity="0.55" />
      <polygon points="24,20 72,20 73,23 23,23" fill={roofLite} />
      {/* Eaves shadow, cast onto the wall directly under the overhang. */}
      <rect x="14" y="44" width="68" height="4" fill={EAVE} />

      {/* Wall */}
      <rect x="16" y="44" width="64" height="40" fill={WALL} />
      <rect x="16" y="44" width="64" height="3" fill={WALL_SHADE} />
      <rect x="16" y="44" width="3" height="40" fill={WALL_SHADE} />
      <rect x="77" y="44" width="3" height="40" fill={WALL_DEEP} />

      {windows.map(([wx, wy], i) => (
        <Window key={i} x={wx} y={wy} lit={active && i % 2 === 0} />
      ))}

      <Door x={door} />

      {/* Plinth: the building meets the ground on something. */}
      <rect x="13" y="84" width="70" height="5" fill={PLINTH} />
      <rect x="13" y="84" width="70" height="2" fill={WALL_DEEP} />
    </>
  )
}

const Window = ({ x, y, lit }) => (
  <>
    <rect x={x - 1} y={y - 1} width="14" height="15" fill={FRAME} />
    <rect x={x} y={y} width="12" height="13" fill={lit ? GLASS_LIT : GLASS} />
    {/* Glazing bar and sill: two rectangles, and the window stops being
        a blue hole. */}
    <rect x={x + 5} y={y} width="2" height="13" fill={FRAME} />
    <rect x={x - 2} y={y + 13} width="16" height="2" fill={WALL_SHADE} />
  </>
)

const Door = ({ x }) => (
  <>
    <rect x={x - 2} y="60" width="20" height="24" fill={FRAME} />
    <rect x={x} y="62" width="16" height="22" fill={DOOR} />
    <rect x={x} y="62" width="16" height="3" fill={DOOR_DARK} />
    <rect x={x + 12} y="72" width="2" height="2" fill={WALL} />
    {/* Step, so the door sits on the ground rather than floating. */}
    <rect x={x - 4} y="84" width="24" height="4" fill={WALL_SHADE} />
  </>
)

/* ------------------------------------------------------------------ */

const SPECS = {
  university: {
    roof: '#B4553D',
    roofDark: '#8A3F2C',
    roofLite: '#CE6E52',
    windows: [
      [22, 52],
      [62, 52],
    ],
    door: 38,
    // A clock tower: the one silhouette that says campus from a distance.
    crown: (accent) => (
      <>
        <rect x="38" y="2" width="20" height="20" fill={WALL} />
        <rect x="38" y="2" width="20" height="2" fill={WALL_SHADE} />
        <rect x="55" y="2" width="3" height="20" fill={WALL_DEEP} />
        <circle cx="48" cy="12" r="6" fill={WALL_SHADE} />
        <circle cx="48" cy="12" r="4" fill={GLASS_LIT} />
        <rect x="47" y="9" width="2" height="4" fill={FRAME} />
        <rect x="48" y="12" width="3" height="2" fill={FRAME} />
        <polygon points="48,-8 60,2 36,2" fill={accent} />
      </>
    ),
  },

  arena: {
    roof: '#4A7BA6',
    roofDark: '#35597C',
    roofLite: '#6598C0',
    windows: [
      [22, 52],
      [62, 52],
    ],
    door: 38,
    // Banners on poles, carrying the stop's own colour.
    crown: (accent) => (
      <>
        <rect x="8" y="8" width="3" height="38" fill={PLINTH} />
        <rect x="85" y="8" width="3" height="38" fill={PLINTH} />
        <polygon points="11,9 27,14 11,19" fill={accent} />
        <polygon points="85,9 69,14 85,19" fill={accent} />
        <rect x="30" y="12" width="36" height="9" fill={accent} />
        <rect x="30" y="12" width="36" height="2" fill="rgba(255,255,255,0.35)" />
      </>
    ),
  },

  office: {
    roof: '#68757F',
    roofDark: '#4B5760',
    roofLite: '#828F99',
    // A window grid rather than two openings: that repetition is what
    // reads as an office rather than a house.
    windows: [
      [22, 50],
      [40, 50],
      [58, 50],
      [22, 68],
      [40, 68],
      [58, 68],
    ],
    door: 38,
    crown: () => (
      <>
        <rect x="26" y="6" width="44" height="16" fill={WALL} />
        <rect x="26" y="6" width="44" height="2" fill={WALL_SHADE} />
        <rect x="67" y="6" width="3" height="16" fill={WALL_DEEP} />
        <rect x="32" y="11" width="10" height="7" fill={GLASS} />
        <rect x="54" y="11" width="10" height="7" fill={GLASS} />
      </>
    ),
  },

  library: {
    roof: '#5A8C4E',
    roofDark: '#40673A',
    roofLite: '#74A566',
    windows: [
      [20, 52],
      [64, 52],
    ],
    door: 38,
    // Pediment and columns.
    crown: (accent) => (
      <>
        <polygon points="48,0 88,16 8,16" fill={WALL} />
        <polygon points="48,3 82,16 14,16" fill={accent} opacity="0.5" />
        <rect x="8" y="16" width="80" height="4" fill={WALL_SHADE} />
      </>
    ),
  },

  workshop: {
    roof: '#A56B3A',
    roofDark: '#7C4E28',
    roofLite: '#C18A54',
    windows: [
      [24, 52],
      [60, 52],
    ],
    door: 40,
    // Chimney with smoke, and a hanging sign.
    crown: (accent) => (
      <>
        <rect x="62" y="4" width="12" height="20" fill={WALL_DEEP} />
        <rect x="60" y="2" width="16" height="4" fill={PLINTH} />
        <circle cx="68" cy="-4" r="4" fill="rgba(240,240,235,0.35)" />
        <circle cx="74" cy="-11" r="3" fill="rgba(240,240,235,0.22)" />
        <rect x="16" y="52" width="4" height="14" fill={PLINTH} />
        <rect x="6" y="56" width="14" height="9" fill={accent} />
      </>
    ),
  },

  civic: {
    roof: '#8763A5',
    roofDark: '#65477F',
    roofLite: '#A480C0',
    windows: [
      [22, 52],
      [62, 52],
    ],
    door: 38,
    crown: (accent) => (
      <>
        <path d="M28 20 A20 20 0 0 1 68 20 Z" fill={WALL} />
        <path d="M34 20 A14 14 0 0 1 62 20 Z" fill={WALL_SHADE} opacity="0.6" />
        <rect x="28" y="18" width="40" height="4" fill={WALL_DEEP} />
        <rect x="46" y="-4" width="4" height="8" fill={accent} />
        <circle cx="48" cy="-6" r="3" fill={accent} />
      </>
    ),
  },
}
