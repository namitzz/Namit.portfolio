/**
 * Outline marks for the timeline stops.
 *
 * These are line-art interpretations of each organisation's mark, drawn to
 * a shared 24px grid so they sit at the same weight as the rest of the
 * page. They are not the official logo files: full-colour marks would
 * fight the section palette and each other. Every path inherits
 * `currentColor`, so a stop recolours with its own accent.
 *
 * Keyed by the timeline entry's `id`. An entry with no match here falls
 * back to its monogram.
 */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

/** University of Leicester: shield, two flowers, open book. */
function LeicesterMark(props) {
  return (
    <svg {...base} {...props} strokeWidth="1.35">
      <path d="M4.2 3.6h15.6v8.9c0 4.5-3.3 6.9-7.8 8.7-4.5-1.8-7.8-4.2-7.8-8.7V3.6Z" />
      <circle cx="9.1" cy="7.5" r="1.45" />
      <circle cx="14.9" cy="7.5" r="1.45" />
      <path d="M7 12.5c1.6-.7 3.4-.7 5 0 1.6-.7 3.4-.7 5 0v3.2c-1.6-.7-3.4-.7-5 0-1.6-.7-3.4-.7-5 0v-3.2Z" />
      <path d="M12 12.5v3.2" />
    </svg>
  )
}

/** Aston University: the swept wedge above the wordmark. */
function AstonMark(props) {
  return (
    <svg {...base} {...props} strokeWidth="1.5">
      <path d="M3.4 5.6h17.2l-9.8 13C10.3 13.7 7.5 8.9 3.4 5.6Z" />
    </svg>
  )
}

/** Class Futures: the double chevron. */
function ClassFuturesMark(props) {
  return (
    <svg {...base} {...props} strokeWidth="1.9">
      <path d="M5 5.4 11.6 12 5 18.6" />
      <path d="M12.5 5.4 19.1 12 12.5 18.6" />
    </svg>
  )
}

/** Generic mark for a competition entry: a rosette. */
function CompetitionMark(props) {
  return (
    <svg {...base} {...props} strokeWidth="1.45">
      <circle cx="12" cy="8.6" r="5.1" />
      <path d="M8.6 13.2 7 21l5-2.6 5 2.6-1.6-7.8" />
    </svg>
  )
}

/** Generic mark for a placement or internship: a building. */
function PlacementMark(props) {
  return (
    <svg {...base} {...props} strokeWidth="1.45">
      <path d="M4 20.5V7.4l8-3.9 8 3.9v13.1" />
      <path d="M3 20.5h18" />
      <path d="M10 20.5v-4.4h4v4.4" />
      <path d="M8.4 10.6h.01M12 10.6h.01M15.6 10.6h.01" />
    </svg>
  )
}

/** Generic mark for a build: angle brackets. */
function ProjectMark(props) {
  return (
    <svg {...base} {...props} strokeWidth="1.7">
      <path d="M9 6.4 3.6 12 9 17.6" />
      <path d="M15 6.4 20.4 12 15 17.6" />
    </svg>
  )
}

export const timelineMarks = {
  project: ProjectMark,
  leicester: LeicesterMark,
  aston: AstonMark,
  classfutures: ClassFuturesMark,
  competition: CompetitionMark,
  placement: PlacementMark,
}

/**
 * Resolves an entry to its mark. `markKey` lets several entries share one
 * (every competition can use the rosette); otherwise the entry's own id
 * is tried before giving up and letting the caller draw the monogram.
 */
export function markFor(entry) {
  return timelineMarks[entry.markKey] || timelineMarks[entry.id] || null
}
