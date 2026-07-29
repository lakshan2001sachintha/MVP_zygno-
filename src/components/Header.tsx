import { Link, useRouter, useRouteContext } from "@tanstack/react-router";
import { toast } from "sonner";

import { logoutFn } from "#/utils/auth";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const router = useRouter();
  const context = useRouteContext({ from: "__root__" }) as any;
  const user = context?.user;

  const handleLogout = async () => {
    try {
      await logoutFn();
      toast.success("Logged out successfully");
      router.invalidate().then(() => {
        window.location.href = "/login";
      });
    } catch (err: any) {
      toast.error("Logout failed: " + err.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            Zygno Institute
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link to="/" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
            Home
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="nav-link"
                  activeProps={{ className: "nav-link is-active" }}
                >
                  Admin Dashboard
                </Link>
              )}
              {user.role === "teacher" && (
                <Link
                  to="/teacher"
                  className="nav-link"
                  activeProps={{ className: "nav-link is-active" }}
                >
                  Teacher Workspace
                </Link>
              )}
              <Link
                to="/modules"
                className="nav-link"
                activeProps={{ className: "nav-link is-active" }}
              >
                Module Explorer
              </Link>
            </>
          ) : (
            <Link
              to="/about"
              className="nav-link"
              activeProps={{ className: "nav-link is-active" }}
            >
              About
            </Link>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--sea-ink-soft)] hidden md:inline">
                {user.fullName} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.2)] border border-[rgba(239,68,68,0.2)] px-3 py-1.5 text-xs font-semibold text-red-600 cursor-pointer transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
            >
              <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
              Sign In
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
