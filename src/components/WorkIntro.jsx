import { motion } from 'framer-motion'

export default function WorkIntro() {
  return (
    <section id="work" className="relative z-10 px-6 pt-20 pb-4 md:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow">Featured work</p>
            <h2 className="section-title mt-3 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
              Five projects. Each one takes over the page.
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/55">
            Scroll through. The background, accents, and mockups shift to match
            the project you’re looking at.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
