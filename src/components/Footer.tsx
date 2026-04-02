import { Globe, MessageCircle, Music, Rss, Share } from "lucide-react";

const links = {
  "Top Categories": [
    "Development",
    "Finance & Accounting",
    "Design",
    "Business",
  ],
  "Quick Links": ["About", "Become Instructor", "Contact", "Career"],
  Support: ["Help Center", "FAQs", "Terms & Conditions", "Privacy Policy"],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Lumina</h3>
              <p className="max-w-md text-sm text-gray-400">
                Learn from top mentors and launch your next milestone with a
                modern online classroom experience.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[Globe, MessageCircle, Share, Music, Rss].map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="rounded-lg bg-white/10 p-2.5 text-white transition hover:bg-primary-500"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(links).map(([title, items]) => (
              <div key={title} className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-white">
                  {title}
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {items.map((item) => (
                    <li key={item} className="hover:text-white">
                      <a href="#">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-gray-700/70 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 text-sm text-gray-400 sm:px-6 md:flex-row lg:px-8">
          <p>© 2026 Cinx E-learning. All rights reserved.</p>
          <p className="text-gray-500">Designed for modern online education</p>
        </div>
      </div>
    </footer>
  );
}
