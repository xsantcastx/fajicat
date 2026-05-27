"use client";

import { useFormStatus } from "react-dom";

const baseClass =
  "rounded-full bg-brand-orange px-6 py-3 font-semibold text-white shadow transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-50";

export function SubmitButton({
  children,
  pendingText = "Guardando…",
  disabled = false,
  className = baseClass,
}: {
  children: React.ReactNode;
  pendingText?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={pending}
      className={className}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner />
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
