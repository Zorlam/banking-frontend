"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { ApiRequestError } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
        Welcome back
      </h1>
      <p className="mt-2 text-[0.95rem] text-ink-400">
        Let's Get Started, Shall We?
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<Mail className="h-[18px] w-[18px]" strokeWidth={1.75} />}
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          prefix={<Lock className="h-[18px] w-[18px]" strokeWidth={1.75} />}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="pointer-events-auto"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.75} />
              ) : (
                <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} />
              )}
            </button>
          }
        />

        {error ? (
          <p role="alert" className="rounded-xl bg-warning-subtle px-3.5 py-2.5 text-sm text-warning">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        New to Zenith?{" "}
        <Link href="/register" className="font-medium text-ink-900 underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
