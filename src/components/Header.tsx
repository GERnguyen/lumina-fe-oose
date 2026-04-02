import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/queries";

function getInitials(name?: string) {
  if (!name) {
    return "U";
  }

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { data: cart } = useCart(isAuthenticated);
  const avatarUrl = user?.profile?.avatar;
  const displayName = user?.profile?.fullName ?? user?.fullName;
  const initials = getInitials(displayName);
  const cartCount = useMemo(
    () => cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0,
    [cart],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      void queryClient.removeQueries({ queryKey: ["cart"] });
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAuthenticated, queryClient]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    void queryClient.removeQueries({ queryKey: ["cart"] });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-800">Lumina</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center justify-start gap-5 lg:flex">
          <Link className="text-sm font-medium text-neutral-800" to="/">
            Home
          </Link>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-neutral-800"
            to="/courses"
          >
            Courses
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-50 hover:text-neutral-800"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {isAuthenticated && cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>

          {isAuthenticated ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-1.5 py-1 pr-2 transition hover:border-primary-300 hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-semibold text-neutral-800">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={
                        displayName ? `${displayName} avatar` : "User avatar"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isUserMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-neutral-800">
                      {displayName ?? "User"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/student"
                    role="menuitem"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-neutral-800"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Student Dashboard
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-danger-600 transition hover:bg-danger-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="outline" colorScheme="primary" size="sm">
                  Create account
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button colorScheme="primary" size="sm">
                  Sign in
                </Button>
              </Link>
            </>
          )}
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
