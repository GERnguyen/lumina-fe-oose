import { BookOpen, LogOut, PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import luminaLogo from "../assets/lumina.svg";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../utils/cn";

const menuItems = [
  {
    label: "Create New Course",
    to: "/instructor/create-course",
    icon: PlusCircle,
  },
  { label: "My Courses", to: "/instructor/courses", icon: BookOpen, end: true },
];

export default function InstructorLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-neutral-800">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between bg-neutral-800 text-gray-400 lg:flex">
        <div>
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white">
                <img src={luminaLogo} alt="Lumina logo" className="h-8 w-8" />
              </div>
              <span className="text-2xl font-semibold text-white">Lumina</span>
            </div>
          </div>

          <nav className="space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-transparent text-gray-400",
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Sign-out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
