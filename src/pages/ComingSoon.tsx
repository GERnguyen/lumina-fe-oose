import { BookOpen, Camera, Mail, PlayCircle, Send, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const countdown = [
  { value: "29", label: "Days" },
  { value: "23", label: "Hours" },
  { value: "59", label: "Mins" },
  { value: "59", label: "Sec" },
];

const footerLinks = ["FAQs", "Privacy Policy", "Terms & Condition"];

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-2xl font-semibold">E-tutor</span>
          </Link>

          <div className="flex items-center gap-2">
            {[
              { name: "Facebook", icon: Users },
              { name: "Twitter", icon: Send },
              { name: "Youtube", icon: PlayCircle },
              { name: "Instagram", icon: Camera },
            ].map((item) => (
              <button
                key={item.name}
                type="button"
                aria-label={item.name}
                className="rounded-lg bg-slate-50 p-3 text-gray-600 transition hover:bg-primary-50 hover:text-primary-500"
              >
                <item.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
        <section className="order-2 flex flex-col justify-center gap-8 lg:order-1">
          <div className="space-y-4">
            <p className="text-base font-semibold uppercase tracking-wide text-primary-500">
              Coming Soon
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-[1.08]">
              We are going to launch our website very soon. Stay tune
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {countdown.map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-slate-50 px-5 py-6 text-center"
              >
                <p className="text-3xl font-semibold leading-10 text-neutral-800">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-neutral-700">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-violet-100">
              <img
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1400&auto=format&fit=crop"
                alt="Coming soon illustration"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl lg:absolute lg:-bottom-10 lg:left-8 lg:right-8 lg:mt-0 lg:p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-neutral-800">
                  Get notified when we launch
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    placeholder="Email address"
                    leftIcon={<Mail className="h-5 w-5 text-primary-500" />}
                  />
                  <Button
                    colorScheme="primary"
                    size="lg"
                    className="sm:shrink-0"
                  >
                    Notify me
                  </Button>
                </div>

                <p className="text-sm text-gray-600">
                  *Don&apos;t worry we will not spam you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center lg:px-8">
          <p className="text-gray-500">
            © 2026 E-tutor. Designed for launch preview. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-neutral-800">
            {footerLinks.map((link) => (
              <button
                key={link}
                type="button"
                className="transition hover:text-primary-500"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
