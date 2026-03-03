import type { ChangeEvent } from "react";

import { cn } from "@/lib/utils";

export interface DropdownOption<T extends string> {
  label: string;
  value: T;
}

export interface DropdownProps<T extends string> {
  className?: string;
  label?: string;
  name?: string;
  onChange?: (value: T) => void;
  options: DropdownOption<T>[];
  value: T;
}

export function Dropdown<T extends string>({
  className,
  label,
  name,
  onChange,
  options,
  value,
}: DropdownProps<T>) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value as T);
  };

  const select = (
    <select className={cn("ui-select", className)} defaultValue={value} name={name} onChange={handleChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  if (!label) {
    return select;
  }

  return (
    <label className="ui-field">
      <span className="ui-field-label">{label}</span>
      {select}
    </label>
  );
}
