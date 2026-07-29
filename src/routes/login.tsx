import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { loginFn, signupFn } from "#/utils/auth";
import { useRouteContext } from "@tanstack/react-router";

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
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>("student");
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
        await signupFn({ data: { email, password, fullName, role } });
        toast.success("Account registered successfully! You can now sign in.");
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
            You are currently signed in as <strong className="text-[var(--sea-ink)]">{loggedInUser.email}</strong>.
          </p>
          <Button onClick={() => window.location.href = "/"}>Go to Dashboard</Button>
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
              <label className="block text-sm font-semibold text-[var(--sea-ink)] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--chip-line)] bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.5)] transition text-sm"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[var(--sea-ink)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@institute.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--chip-line)] bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.5)] transition text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--sea-ink)] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--chip-line)] bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.5)] transition text-sm"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-[var(--sea-ink)] mb-1">
                Platform Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--chip-line)] bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.5)] transition text-sm"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full mt-2 font-semibold">
            {isLoading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
          {isSignUp ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                className="text-[var(--lagoon-deep)] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
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
                className="text-[var(--lagoon-deep)] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
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
