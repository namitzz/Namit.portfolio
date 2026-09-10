import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * The window onto the map: how far in, and where.
 *
 * Zoom is whole numbers only. Pixel art at a fractional scale is mush,
 * and this map is nothing but pixel art, so 1.5x is not a smaller step
 * towards 2x, it is a worse picture. Three steps is enough: the whole
 * journey, the region, and the ground.
 *
 * There is deliberately no wheel handler. Catching the wheel over a
 * section of a page steals the reader's scroll, and a map that traps you
 * on the way past is worse than one you cannot zoom. Zoom is on buttons,
 * on double-click, and on the keyboard.
 *
 * `x` and `y` are the top-left of the window in map coordinates, which is
 * the same space the milestones are placed in, so anything that needs to
 * follow the map can use `project` and be done.
 */

export const MAX_ZOOM = 3

export function useMapView(width, height) {
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 })
  const drag = useRef(null)

  /** Keeps the window inside the map, whatever just moved it. */
  const clamp = useCallback(
    (next) => {
      const zoom = Math.min(MAX_ZOOM, Math.max(1, next.zoom))
      const maxX = Math.max(0, width - width / zoom)
      const maxY = Math.max(0, height - height / zoom)
      return {
        zoom,
        x: Math.min(maxX, Math.max(0, next.x)),
        y: Math.min(maxY, Math.max(0, next.y)),
      }
    },
    [width, height],
  )

  // A resize can leave the window hanging off the edge of a map that just
  // got smaller.
  useEffect(() => {
    setView((v) => clamp(v))
  }, [clamp])

  /**
   * Zoom about a point, so what you aimed at stays where it is. Zooming
   * about the centre instead makes the thing you were looking at slide
   * away, which is the difference between a map and a slideshow.
   */
  const zoomAt = useCallback(
    (nextZoom, px, py) => {
      setView((v) => {
        const zoom = Math.min(MAX_ZOOM, Math.max(1, nextZoom))
        if (zoom === v.zoom) return v
        const worldX = v.x + px / v.zoom
        const worldY = v.y + py / v.zoom
        return clamp({ zoom, x: worldX - px / zoom, y: worldY - py / zoom })
      })
    },
    [clamp],
  )

  // The zoom buttons keep the same identity across renders, so they read
  // the current zoom from a ref rather than closing over a stale one.
  const latest = useRef(view)
  latest.current = view

  const zoomIn = useCallback(
    () => zoomAt(latest.current.zoom + 1, width / 2, height / 2),
    [zoomAt, width, height],
  )
  const zoomOut = useCallback(
    () => zoomAt(latest.current.zoom - 1, width / 2, height / 2),
    [zoomAt, width, height],
  )
  const reset = useCallback(() => setView({ zoom: 1, x: 0, y: 0 }), [])

  const onPointerDown = useCallback(
    (e) => {
      if (view.zoom <= 1) return
      // Left button only, and never on a milestone: those are buttons.
      if (e.button !== 0 || e.target.closest('button')) return
      drag.current = { px: e.clientX, py: e.clientY, x: view.x, y: view.y }
      // Capture keeps the drag alive when the pointer leaves the map, but
      // it throws if the pointer has already gone: a pen lifted mid-press,
      // a synthetic event, a touch the browser has taken for a gesture.
      // Losing capture makes the drag worse, not broken, so it must never
      // be the thing that stops it.
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId)
      } catch {
        /* dragging still works, it just ends at the edge */
      }
    },
    [view],
  )

  const onPointerMove = useCallback(
    (e) => {
      const d = drag.current
      if (!d) return
      setView((v) =>
        clamp({
          zoom: v.zoom,
          x: d.x - (e.clientX - d.px) / v.zoom,
          y: d.y - (e.clientY - d.py) / v.zoom,
        }),
      )
    },
    [clamp],
  )

  const onPointerUp = useCallback((e) => {
    drag.current = null
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      /* nothing to release: the pointer is already gone */
    }
  }, [])

  const onDoubleClick = useCallback(
    (e) => {
      if (e.target.closest('button')) return
      const box = e.currentTarget.getBoundingClientRect()
      const next = view.zoom >= MAX_ZOOM ? 1 : view.zoom + 1
      if (next === 1) {
        reset()
        return
      }
      zoomAt(next, e.clientX - box.left, e.clientY - box.top)
    },
    [view.zoom, zoomAt, reset],
  )

  /** Map coordinates to screen coordinates, for anything drawn over it. */
  const project = useCallback(
    (x, y) => ({
      x: (x - view.x) * view.zoom,
      y: (y - view.y) * view.zoom,
    }),
    [view],
  )

  const handlers = useMemo(
    () => ({ onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onDoubleClick }),
    [onPointerDown, onPointerMove, onPointerUp, onDoubleClick],
  )

  return {
    view,
    project,
    handlers,
    zoomIn,
    zoomOut,
    reset,
    canZoomIn: view.zoom < MAX_ZOOM,
    canZoomOut: view.zoom > 1,
    dragging: view.zoom > 1,
  }
}
