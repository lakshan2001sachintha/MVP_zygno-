import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { loginFn, signupFn } from "#/utils/auth";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const router = useRouter();
  const context = useRouteContext({ from: "__root__" }) as any;
  const loggedInUser = context?.user;

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"teacher" | "student">("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !fullName)) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        const result = await signupFn({ data: { email, password, fullName, role } });
        toast.success(
          result.session
            ? "Account registered successfully."
            : "Account registered. Confirm your email before signing in.",
        );
        setIsSignUp(false);
      } else {
        await loginFn({ data: { email, password } });
        toast.success("Welcome back!");

        // Heavy refresh the state and redirect to base
        router.invalidate().then(() => {
          window.location.href = "/";
        });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loggedInUser) {
    return (
      <main className="page-wrap px-4 pt-14 pb-8 flex flex-col items-center">
        <div className="island-shell w-full max-w-md p-8 rounded-2xl flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Already Logged In</h2>
          <p className="text-[var(--sea-ink-soft)] mb-6">
            You are currently signed in as{" "}
            <strong className="text-[var(--sea-ink)]">{loggedInUser.email}</strong>.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[#79d9d0] font-bold text-[#07383c] hover:bg-[#98e7df]"
          >
            Go to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap px-4 pt-14 pb-8 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="island-shell w-full max-w-md p-8 rounded-[2rem] relative overflow-hidden transition-all shadow-[0_12px_40px_rgba(23,68,54,0.06)]">
        <div className="pointer-events-none absolute -top-16 -left-16 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.2),transparent_66%)]" />

        <h1 className="text-3xl font-bold text-[var(--sea-ink)] tracking-tight mb-2 text-center">
          {isSignUp ? "Create an Account" : "Sign In to Portal"}
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)] text-center mb-8">
          {isSignUp
            ? "Sign up to access modules and workspace tools"
            : "Enter credentials to access dashboards"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label
                htmlFor="signup-full-name"
                className="block text-sm font-semibold text-[var(--sea-ink)] mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="signup-full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-[#9aabad] bg-[#eef3f3] px-4 py-2.5 text-sm font-medium text-[#173a40] placeholder:text-[#6b7f82] backdrop-blur transition focus:border-[#4fb8b2] focus:ring-2 focus:ring-[rgba(79,184,178,0.5)] focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block text-sm font-semibold text-[var(--sea-ink)] mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="auth-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@institute.edu"
              className="w-full rounded-xl border border-[#9aabad] bg-[#eef3f3] px-4 py-2.5 text-sm font-medium text-[#173a40] placeholder:text-[#6b7f82] backdrop-blur transition focus:border-[#4fb8b2] focus:ring-2 focus:ring-[rgba(79,184,178,0.5)] focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-sm font-semibold text-[var(--sea-ink)] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="auth-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#9aabad] bg-[#eef3f3] px-4 py-2.5 text-sm font-medium text-[#173a40] placeholder:text-[#6b7f82] backdrop-blur transition focus:border-[#4fb8b2] focus:ring-2 focus:ring-[rgba(79,184,178,0.5)] focus:outline-none"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="signup-role"
                className="block text-sm font-semibold text-[var(--sea-ink)] mb-1"
              >
                Platform Role
              </label>
              <select
                id="signup-role"
                value={role}
                onChange={(e) => setRole(e.target.value as "teacher" | "student")}
                className="w-full rounded-xl border border-[#9aabad] bg-[#eef3f3] px-3 py-2.5 text-sm font-medium text-[#173a40] backdrop-blur transition focus:border-[#4fb8b2] focus:ring-2 focus:ring-[rgba(79,184,178,0.5)] focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full border border-[var(--chip-line)] bg-[var(--lagoon)] font-bold text-[#07383c] shadow-sm hover:bg-[var(--lagoon-deep)] hover:text-[#07383c]"
          >
            {isLoading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
          {isSignUp ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 font-bold text-[var(--lagoon-deep)] hover:text-[var(--sea-ink)] hover:underline"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{" "}
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 font-bold text-[var(--lagoon-deep)] hover:text-[var(--sea-ink)] hover:underline"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
