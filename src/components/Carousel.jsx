import { useRef, useState } from 'react'

export default function Carousel({ items }) {
  const [current, setCurrent] = useState(0)
  const total = items.length
  const next = () => setCurrent(c => (c + 1) % total)
  const prev = () => setCurrent(c => (c - 1 + total) % total)

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="w-full flex justify-center items-center">
        <button onClick={prev} className="absolute left-0 z-10 px-4 py-2 text-2xl text-warmbrown/60 hover:text-warmbrown">&#8592;</button>
        <div className="w-full max-w-3xl flex justify-center">
          {items[current]}
        </div>
        <button onClick={next} className="absolute right-0 z-10 px-4 py-2 text-2xl text-warmbrown/60 hover:text-warmbrown">&#8594;</button>
      </div>
      <div className="mt-4 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            className={`h-2 w-2 rounded-full ${i === current ? 'bg-warmbrown' : 'bg-warmbrown/20'}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
