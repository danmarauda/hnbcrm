import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      if (flow === "signIn") {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message ?? "Sign-in failed");
      } else {
        const { error } = await authClient.signUp.email({ email, password, name: email.split("@")[0] });
        if (error) throw new Error(error.message ?? "Sign-up failed");
      }
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("password")) {
        toast.error("Invalid password. Try again.");
      } else {
        toast.error(
          flow === "signIn"
            ? "Could not sign in. Did you mean to sign up?"
            : "Could not sign up. Did you mean to sign in?"
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm">
          <span className="text-text-secondary">
            {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-brand-500 hover:text-brand-400 hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-border" />
        <span className="mx-4 text-text-muted">or</span>
        <hr className="my-4 grow border-border" />
      </div>
      <button
        className="auth-button"
        onClick={async () => {
          const { error } = await authClient.signIn.anonymous();
          if (error) toast.error("Anonymous sign-in failed");
        }}
      >
        Sign in anonymously
      </button>
    </div>
  );
}
