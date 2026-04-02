import { BookOpen, Menu, Search, ShoppingCart } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-neutral-800">Lumina</p>
          </div>
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          <a className="text-sm font-medium text-neutral-800" href="#">
            Home
          </a>
          <a
            className="text-sm font-medium text-gray-600 hover:text-neutral-800"
            href="#"
          >
            Courses
          </a>
          <a
            className="text-sm font-medium text-gray-600 hover:text-neutral-800"
            href="#"
          >
            About
          </a>
          <a
            className="text-sm font-medium text-gray-600 hover:text-neutral-800"
            href="#"
          >
            Contact
          </a>
        </nav>

        <div className="hidden w-full max-w-md xl:block">
          <Input
            placeholder="What do you want to learn?"
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-50 hover:text-neutral-800"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <Button variant="outline" colorScheme="primary" size="sm">
            Create account
          </Button>
          <Button colorScheme="primary" size="sm">
            Sign in
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-50 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
