"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/dashboard-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setError(result.message || "Sign in failed.");
        return;
      }

      router.refresh();
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate__animated animate__bounceIn animate__slowest w-full rounded-2xl border border-white/40 bg-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-white/25 backdrop-blur-md sm:max-w-md sm:rounded-3xl sm:p-8 md:max-w-lg md:p-10"
    >
        <h1 className="text-center text-xl font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:text-left sm:text-2xl md:text-3xl">
          Admin sign in
        </h1>
        <p className="mt-2 text-center text-sm text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] sm:mt-3 sm:text-left sm:text-base">
          Enter your dashboard password to continue.
        </p>

        <label
          className="mt-6 block text-sm font-medium text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] sm:mt-8 sm:text-base"
          htmlFor="dashboard-password"
        >
          Password
        </label>
        <div className="relative mt-2 sm:mt-3">
          <input
            id="dashboard-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full min-h-11 rounded-xl border border-white/40 bg-black/15 py-2.5 pl-3 pr-12 text-sm text-white placeholder:text-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)] outline-none backdrop-blur-sm ring-white/50 focus:ring-2 sm:min-h-12 sm:py-3 sm:pl-4 sm:pr-14 sm:text-base md:pr-16"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center rounded-r-xl px-3 text-base text-white/90 transition hover:bg-white/20 hover:text-white sm:min-h-12 sm:min-w-12 sm:px-4 sm:text-lg"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-center text-sm text-red-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:mt-4 sm:text-left sm:text-base">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 min-h-11 w-full rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] shadow-lg backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-8 sm:min-h-12 sm:py-3 sm:text-base"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
    </form>
  );
}
