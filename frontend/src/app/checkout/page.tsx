"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/Button";
import { createTransaction } from "@/services/transactionService";
import Image from "next/image";
import toast from "react-hot-toast";

const currentDate = new Date();

const schema = z
  .object({
    customer_name: z.string().min(1, "Nombre requerido"),
    customer_email: z.string().email("Correo inválido"),
    amount: z.coerce.number().positive("Monto requerido"),
    currency: z.enum(["MXN", "USD"], {
      errorMap: () => ({ message: "Debe seleccionar MXN o USD" }),
    }),
    card_number: z.string().regex(/^\d{16}$/, "Debe tener exactamente 16 dígitos"),
    exp_month: z
      .string()
      .regex(/^\d{1,2}$/, "Debe ser un número de 1 a 12")
      .refine((val) => {
        const num = parseInt(val);
        return num >= 1 && num <= 12;
      }, { message: "Mes inválido (debe ser entre 1 y 12)" }),
    exp_year: z
      .string()
      .regex(/^\d{4}$/, "Debe ser un año válido de 4 dígitos")
      .refine((val) => parseInt(val) >= currentDate.getFullYear(), {
        message: `El año debe ser mayor o igual a ${currentDate.getFullYear()}`,
      }),
    cvc: z.string().regex(/^\d{3}$/, "El CVC debe tener exactamente 3 dígitos numéricos"),
  })
  .superRefine((data, ctx) => {
    const { exp_month, exp_year } = data;
    const month = parseInt(exp_month);
    const year = parseInt(exp_year);

    if (!isNaN(month) && !isNaN(year)) {
      const expDate = new Date(year, month - 1);
      if (expDate < new Date(currentDate.getFullYear(), currentDate.getMonth())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La fecha de expiración no puede ser anterior al mes actual",
          path: ["exp_month"],
        });
      }
    }
  });

type CheckoutForm = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    defaultValues: { currency: "MXN" }
  });

  const selectedCurrency = useWatch({ control, name: "currency" });
  const currencySymbol = selectedCurrency === "USD" ? "$" : "MX$";

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const result = await createTransaction({
        amount: data.amount,
        currency: data.currency,
        customer_email: data.customer_email,
        customer_name: data.customer_name,
        card: {
          number: data.card_number,
          exp_month: data.exp_month,
          exp_year: data.exp_year,
          cvc: data.cvc
        }
      });
      router.push(`/confirm?id=${result.id}`);
    } catch (err: any) {
      toast.error(err.message || "Error al procesar el pago");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-xl shadow overflow-hidden">
        <div className="w-full h-48 relative">
          <Image
            src="/images/illustration-payment.png"
            alt="Ilustración de pago"
            fill
            className="object-cover rounded-t-xl"
          />
        </div>

        <div className="p-6 md:p-10">
          <h1 className="text-2xl font-semibold mb-6">Pago con tarjeta</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Nombre completo" {...register("customer_name")} error={errors.customer_name} />
            <FormInput label="Correo electrónico" type="email" {...register("customer_email")} error={errors.customer_email} />
            <FormInput
              label={`Monto (${currencySymbol})`}
              type="number"
              step="0.01"
              {...register("amount")}
              error={errors.amount}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
              <select
                {...register("currency")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MXN">MXN (Pesos Mexicanos)</option>
                <option value="USD">USD (Dólares)</option>
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
              )}
            </div>
            <hr className="my-4" />
            <FormInput
              label="Número de tarjeta"
              autoComplete="off"
              type="tel"
              inputMode="numeric"
              pattern="\d{16}"
              maxLength={16}
              {...register("card_number")}
              error={errors.card_number}
            />
            <div className="flex gap-2">
              <FormInput
                label="Mes"
                autoComplete="off"
                placeholder="MM"
                type="tel"
                inputMode="numeric"
                pattern="\d{1,2}"
                maxLength={2}
                {...register("exp_month")}
                error={errors.exp_month}
              />
              <FormInput
                label="Año"
                autoComplete="off"
                placeholder="YYYY"
                type="tel"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                {...register("exp_year")}
                error={errors.exp_year}
              />
            </div>
            <FormInput
              label="CVC"
              autoComplete="off"
              type="tel"
              inputMode="numeric"
              pattern="\d{3}"
              maxLength={3}
              {...register("cvc")}
              error={errors.cvc}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
              {isSubmitting ? "Procesando..." : "Pagar ahora"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}