"use client";

import React, { useEffect } from "react";
import Button from "@/components/common/Button";
import InputField from "@/components/common/InputField";
import Spinner from "../common/Spinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInFormData } from "@/lib/types/auth/types";
import { loginSchema } from "@/lib/schemas";
import { ThemeToggle } from "../common/ThemeToggle";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const onSubmit = async (data: SignInFormData) => {
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      alert("Invalid credentials. Please try again.");
    } else {
      router.push(callbackUrl);
    }
  };

  if (status === "loading") return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="bg-orange-50 dark:bg-[#2d291c] border border-orange-200 dark:border-orange-800 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">
                Admin Dashboard
              </h3>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Welcome to Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            type="text"
            placeholder="Enter Email"
            register={register("email")}
            errorMessage={errors.email?.message}
          />

          <InputField
            type="password"
            placeholder="Enter Password"
            register={register("password")}
            errorMessage={errors.password?.message}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            customClass="w-full mt-4"
          >
            Sign in
          </Button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-background text-gray-500 dark:text-gray-400">
                  &copy; all rights reserved
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
