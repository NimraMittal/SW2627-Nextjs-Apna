"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Building2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { signUpUser } from "@/app/actions/auth-actions";

type Role = "CANDIDATE" | "EMPLOYER";

const initialState = { success: false, message: "" };

export default function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CANDIDATE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setResult(initialState);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("role", role);
    if (role === "EMPLOYER") formData.set("companyName", companyName);

    startTransition(async () => {
      const res = await signUpUser(initialState, formData);
      setResult(res);

      if (res.success) {
        // Auto-login after signup
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (!loginRes?.error) {
          router.push(role === "EMPLOYER" ? "/employer" : "/");
          router.refresh();
        }
      }
    });
  }

  return (
    <form onSubmit={handleSignup}>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
      <p className="text-gray-500 text-sm mb-4">Sign up to get started.</p>

      {/* Role Selector */}
      <div className="flex gap-2 mb-5">
        {(["CANDIDATE", "EMPLOYER"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
              role === r
                ? "bg-blue-700 text-white border-blue-700"
                : "border-gray-300 text-gray-600 hover:border-blue-400"
            }`}
          >
            {r === "CANDIDATE" ? "🎓 Candidate" : "🏢 Employer"}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {result.message && (
        <div
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 ${
            result.success
              ? "bg-green-50 border border-green-200 text-green-600"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          {result.success ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {result.message}
        </div>
      )}

      {/* Full Name */}
      <label className="text-sm font-medium text-gray-700">Full Name</label>
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-4">
        <User size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="outline-none text-sm w-full"
        />
      </div>

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
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-4">
        <Lock size={16} className="text-gray-400" />
        <input
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="outline-none text-sm w-full"
        />
      </div>

      {/* Company Name — only for employers */}
      {role === "EMPLOYER" && (
        <>
          <label className="text-sm font-medium text-gray-700">Company Name</label>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-4">
            <Building2 size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="outline-none text-sm w-full"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
      >
        {isPending ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : "Create Account"}
      </button>
    </form>
  );
}