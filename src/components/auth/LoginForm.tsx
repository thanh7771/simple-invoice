"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/login";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useLogin } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/client/get-error-message";

export function LoginForm() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    login.mutate(data);
  }

  const serverError = login.isError
    ? getErrorMessage(login.error, "Login failed. Please try again.")
    : "";

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">SimpleInvoice</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your invoices
          </p>
        </div>

        {serverError && (
          <div className="mb-4">
            <Alert
              type="error"
              message={serverError}
              onDismiss={() => login.reset()}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Username"
            type="text"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" loading={login.isPending} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
