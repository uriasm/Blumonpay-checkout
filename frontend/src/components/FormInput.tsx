"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, onInput, type, inputMode, ...rest }, ref) => {
    const isNumeric = inputMode === "numeric" || type === "tel";

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      if (isNumeric) {
        // Elimina cualquier caracter que no sea número
        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
      }
      if (onInput) onInput(e); // Ejecuta el onInput del usuario si existe
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          inputMode={inputMode}
          className={clsx(
            "w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500",
            className
          )}
          onInput={handleInput}
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";