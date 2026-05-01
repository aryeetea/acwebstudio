const team = [
  {
    name: 'Aileen',
    role: 'Web Development',
    image: '/aileen-about.jpeg',
    rotation: '-rotate-[5deg] md:translate-y-8',
    accent: 'before:bg-[radial-gradient(circle_at_top,rgba(196,168,130,0.22),transparent_70%)]',
  },
  {
    name: 'Cynthia',
    role: 'UI/UX Design',
    image: '/cynthia-about.jpeg',
    rotation: 'rotate-[1.5deg] md:-translate-y-4',
    accent: 'before:bg-[radial-gradient(circle_at_top,rgba(231,188,105,0.18),transparent_70%)]',
  },
  {
    name: 'Edwina',
    role: 'Art Director',
    image: '/edwina-about.png',
    rotation: 'rotate-[4deg] md:translate-y-12',
    accent: 'before:bg-[radial-gradient(circle_at_top,rgba(168,111,70,0.18),transparent_70%)]',
  },
]

export default function PortraitCard() {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="absolute inset-x-10 top-10 h-28 rounded-full bg-[radial-gradient(circle,rgba(196,168,130,0.18),transparent_72%)] blur-3xl" />
      <div className="absolute left-1/2 top-24 hidden h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,244,227,0.75),transparent_72%)] blur-3xl md:block" />

      <div className="relative grid gap-8 md:grid-cols-3 md:items-start">
        {team.map(member => (
          <article
            key={member.name}
            className={`group relative mx-auto w-full max-w-[320px] ${member.rotation} transition duration-500 hover:z-10 hover:translate-y-0 hover:rotate-0`}
          >
            <div className={`relative before:absolute before:inset-3 before:rounded-[28px] before:content-[''] ${member.accent}`}>
              <div className="relative rounded-[10px] border border-[#d8cab6] bg-[#f8f1e7] p-4 pb-7 shadow-[0_26px_60px_rgba(27,22,18,0.14)]">
                <div className="rounded-[6px] bg-[#efe4d6] p-2 shadow-[inset_0_0_0_1px_rgba(120,92,64,0.08)]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="block aspect-[4/5] w-full rounded-[4px] object-cover object-center shadow-[0_10px_20px_rgba(27,22,18,0.12)]"
                  />
                </div>

                <div className="mt-5 border-t border-[#dcccb9] pt-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.24em] text-warmbrown/75">
                    {member.role}
                  </div>
                  <div className="mt-2 font-display text-[2rem] leading-none text-ink">
                    {member.name}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
