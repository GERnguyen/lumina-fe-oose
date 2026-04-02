import { ArrowRight, BellDot, Heart, ShoppingCart } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import { cn } from "../utils/cn";

const tabs = [
  { label: "Dashboard", to: "/student" },
  { label: "Courses", to: "/student/courses" },
  { label: "Purchase History", to: "/student/purchase-history" },
  { label: "Settings", to: "/student/settings" },
];

export default function StudentDashboardLayout() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />

      <section className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-orange-100 bg-white">
            <div className="flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <img
                  className="h-20 w-20 rounded-full object-cover sm:h-28 sm:w-28"
                  src="https://placehold.co/110x110"
                  alt="Kevin Gilbert"
                />
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold text-neutral-800">
                    Kevin Gilbert
                  </h1>
                  <p className="text-base text-gray-500">
                    Web Designer & Best-Selling Instructor
                  </p>
                  <div className="flex items-center gap-3 text-gray-600 md:hidden">
                    <BellDot className="h-5 w-5" />
                    <Heart className="h-5 w-5" />
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" colorScheme="primary" size="lg">
                  Become Instructor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border-t border-orange-100 px-4 sm:px-6">
              <nav className="flex items-center gap-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.to === "/student"}
                    className={({ isActive }) =>
                      cn(
                        "px-5 py-5 text-base font-medium text-gray-600 transition",
                        isActive &&
                          "text-neutral-800 shadow-[inset_0px_-3px_0px_0px_rgba(255,102,54,1.00)]",
                      )
                    }
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
