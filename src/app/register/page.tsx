"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { ApiRequestError } from "@/lib/api";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register(fullName, email, password);
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
        Open an account
      </h1>
      <p className="mt-2 text-[0.95rem] text-ink-400">
        Takes about a minute. No paperwork.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          prefix={<User className="h-[18px] w-[18px]" strokeWidth={1.75} />}
        />
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
          autoComplete="new-password"
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
          hint="At least 8 characters, with a letter and a number."
        />

        {error ? (
          <p role="alert" className="rounded-xl bg-warning-subtle px-3.5 py-2.5 text-sm text-warning">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink-900 underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
