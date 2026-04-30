const team = [
  {
    name: 'Cynthia',
    role: 'UI/UX Director',
    image: '/cynthia-about.jpeg',
  },
  {
    name: 'Aileen',
    role: 'Web Development',
    image: '/aileen-about.jpeg',
  },
]

export default function PortraitCard() {
  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div className="animate-float-soft absolute -bottom-6 -left-5 h-[62%] w-[58%] rounded-[32px] bg-[radial-gradient(circle,rgba(240,23,106,0.22),transparent_68%)] blur-xl" />

      <div className="relative space-y-5">
        {team.map(member => (
          <article
            key={member.name}
            className="overflow-hidden rounded-[4px] border border-warmbrown-pale/70 bg-softwhite shadow-[0_24px_60px_rgba(17,17,16,0.10)]"
          >
            <div className="bg-cream p-4">
              <img
                src={member.image}
                alt={member.name}
                className="block h-auto w-full rounded-[4px] object-contain"
              />
            </div>

            <div className="border-t border-warmbrown-pale bg-softwhite px-5 py-4">
              <div className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-warmbrown">
                {member.role}
              </div>
              <div className="mt-2 font-display text-[2rem] leading-none text-ink">
                {member.name}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
