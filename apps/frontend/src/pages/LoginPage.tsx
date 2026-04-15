import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const LoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const success = login(password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Incorrect password. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
      <div
        className="w-full max-w-sm bg-white border-2 border-brand-primary p-8
                   shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]"
      >
        <h1
          className="font-display text-2xl uppercase tracking-tight mb-2"
          data-testid="login-heading"
        >
          Admin Login
        </h1>
        <p className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-8">
          Dashboard access only
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="admin-password"
            className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-brand-primary px-4 py-3 font-mono text-sm
                       focus:outline-none focus:border-brand-accent mb-4"
            placeholder="Enter admin password"
            autoComplete="current-password"
            data-testid="password-input"
            required
          />

          {error && (
            <p
              className="font-mono text-xs text-red-600 mb-4"
              role="alert"
              data-testid="login-error"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="w-full bg-brand-primary text-white font-mono text-xs uppercase
                       tracking-widest py-3 hover:bg-brand-accent transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="login-submit"
          >
            {submitting ? "Checking…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
