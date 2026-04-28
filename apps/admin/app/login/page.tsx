"use client";

import { useActionState } from "react";

import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <main className="page-shell compact">
      <section className="panel" aria-labelledby="login-title">
        <p className="eyebrow">ParentMeet Internal</p>
        <h1 id="login-title">Admin login</h1>
        <p className="lede">
          Sign in with a Supabase account that has an admin or moderator role.
        </p>

        <form action={formAction} className="form-stack">
          {state.error ? <p className="error-box">{state.error}</p> : null}
          <label>
            <span>Email</span>
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              name="password"
              required
              type="password"
            />
          </label>
          <button disabled={isPending} type="submit">
            {isPending ? "Signing in" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
