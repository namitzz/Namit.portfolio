import { motion } from 'framer-motion'

/**
 * Faithful preview of cloudsevenrealty.com.
 * Light/cream scheme nested inside a browser chrome — deliberately
 * contrasts with the dark portfolio surround.
 */
export default function CloudSevenMock() {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span>Cloud Seven Realty · Live site</span>
        <a
          href="https://www.cloudsevenrealty.com/"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--accent)' }}
          className="hover:underline"
        >
          cloudsevenrealty.com ↗
        </a>
      </div>

      {/* Browser chrome */}
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-card">
        <div className="flex items-center gap-1.5 border-b border-black/10 bg-[#f3efe7] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="ml-3 rounded-md bg-white px-3 py-0.5 font-mono text-[10px] text-black/55">
            https://www.cloudsevenrealty.com
          </span>
        </div>

        {/* Light interior */}
        <div className="relative bg-[#f7f3eb] text-[#1a1814]">
          {/* Site nav */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <CloudLogo />
              <div className="leading-tight">
                <div className="font-display text-[15px] font-semibold tracking-tight">
                  Cloud Seven Realty
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                  Jammu &amp; Kashmir
                </div>
              </div>
            </div>
            <div className="hidden items-center gap-5 text-[12px] text-black/70 sm:flex">
              <span>Properties</span>
              <span>Areas</span>
              <span>Contact</span>
              <span
                className="rounded-full px-3 py-1.5 text-[11px] font-semibold"
                style={{ background: '#1a1814', color: '#f7f3eb' }}
              >
                List with us
              </span>
            </div>
          </div>

          {/* Hero */}
          <div className="relative px-6 pt-2 pb-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-black/45">
              Premium Selection
            </p>
            <h4 className="mt-2 max-w-md font-display text-[26px] font-semibold leading-[1.1]">
              Premium real estate with{' '}
              <span style={{ color: '#8a6a2e' }}>verified titles</span> and
              trusted on-ground support across J&amp;K.
            </h4>
            <p className="mt-2 max-w-sm text-[12px] text-black/55">
              Curated rentals, homes, and land, sourced and vetted locally in
              Srinagar.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                className="rounded-full px-4 py-2 text-[12px] font-semibold"
                style={{ background: '#1a1814', color: '#f7f3eb' }}
              >
                View all properties
              </button>
              <button className="rounded-full border border-black/15 px-4 py-2 text-[12px] text-black/75">
                Contact via website
              </button>
            </div>
          </div>

          {/* Property cards — real listings from the site */}
          <div className="grid grid-cols-3 gap-3 px-6 pb-5">
            {[
              {
                t: 'Karanagar',
                sub: 'Gol Market · Srinagar',
                tag: 'Rent',
                kind: 'Commercial space',
                stripe: 'linear-gradient(135deg,#cfa46a 0%,#7a5a30 100%)',
              },
              {
                t: 'Bemina',
                sub: 'Srinagar',
                tag: 'Buy',
                kind: 'House for sale',
                stripe: 'linear-gradient(135deg,#5d6e57 0%,#2b362a 100%)',
              },
              {
                t: 'Nishat',
                sub: 'Foothills · Srinagar',
                tag: 'Land',
                kind: 'Plot for sale',
                stripe: 'linear-gradient(135deg,#a89ca5 0%,#4a4350 100%)',
              },
            ].map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"
              >
                <div className="relative h-24 w-full" style={{ background: p.stripe }}>
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-black/80">
                    {p.tag}
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/90">
                    Explore →
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-display text-[13px] font-semibold text-black/85">
                    {p.t}
                  </p>
                  <p className="mt-0.5 text-[10px] text-black/50">{p.sub}</p>
                  <p className="mt-2 text-[11px] text-black/70">{p.kind}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-px border-t border-black/10 bg-black/[0.04]">
            {[
              { t: 'Verified titles', s: 'Documents checked locally' },
              { t: 'On-ground support', s: 'Srinagar-based team' },
              { t: 'Local expertise', s: 'J&K-only specialisation' },
            ].map((b) => (
              <div key={b.t} className="bg-[#f7f3eb] p-3">
                <p className="text-[11px] font-semibold text-black/85">
                  {b.t}
                </p>
                <p className="mt-0.5 text-[10px] text-black/50">{b.s}</p>
              </div>
            ))}
          </div>

          {/* Contact ribbon — public-safe labels, real details live on the site */}
          <div
            className="flex items-center justify-between px-6 py-3 text-[11px]"
            style={{ background: '#1a1814', color: '#e8dfcc' }}
          >
            <span className="font-mono">Contact via website</span>
            <span className="hidden sm:inline opacity-60">Srinagar, J&amp;K</span>
            <span className="font-mono">WhatsApp contact available on site</span>
          </div>
        </div>
      </div>

      {/* Notes strip — under the browser frame, lives in dark portfolio */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
        {[
          { l: 'Stack', v: 'Next.js · Tailwind · Sheets API' },
          { l: 'CMS', v: 'Google Sheets + Drive · ISR' },
          { l: 'Role', v: 'Design + frontend' },
        ].map((n) => (
          <div key={n.l} className="glass rounded-xl px-3.5 py-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              {n.l}
            </p>
            <p className="mt-1 text-sm font-medium text-white/85">{n.v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CloudLogo() {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-lg"
      style={{ background: '#1a1814' }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M7 17h10a4 4 0 0 0 0-8 5 5 0 0 0-9.6-1.4A3.5 3.5 0 0 0 7 17Z"
          stroke="#e8c98b"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="12"
          y="15"
          textAnchor="middle"
          fontSize="6"
          fontWeight="700"
          fill="#e8c98b"
          fontFamily="Space Grotesk, sans-serif"
        >
          7
        </text>
      </svg>
    </span>
  )
}
