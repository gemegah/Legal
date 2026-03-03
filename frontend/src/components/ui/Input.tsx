import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hint?: string;
  label?: string;
}

export function Input({ className, error, hint, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name ?? undefined;

  return (
    <label className="ui-field" htmlFor={inputId}>
      {label ? <span className="ui-field-label">{label}</span> : null}
      <input
        {...props}
        aria-invalid={Boolean(error)}
        className={cn("ui-input", className)}
        id={inputId}
      />
      {error ? <span className="ui-field-error">{error}</span> : null}
      {!error && hint ? <span className="ui-field-hint">{hint}</span> : null}
    </label>
  );
}
