"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      // Fetch the session to know the role for redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "EMPLOYER") {
        router.push("/employer");
      } else {
        router.push("/");
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleLogin}>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h2>
      <p className="text-gray-500 text-sm mb-6">Login to continue to your account.</p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Email */}
      <label className="text-sm font-medium text-gray-700">Email</label>
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-4">
        <Mail size={16} className="text-gray-400" />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="outline-none text-sm w-full"
        />
      </div>

      {/* Password */}
      <label className="text-sm font-medium text-gray-700">Password</label>
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-6">
        <Lock size={16} className="text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="outline-none text-sm w-full"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff size={16} className="text-gray-400" />
          ) : (
            <Eye size={16} className="text-gray-400" />
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
      >
        {isPending ? <><Loader2 size={16} className="animate-spin" /> Logging in...</> : "Login"}
      </button>
    </form>
  );
}