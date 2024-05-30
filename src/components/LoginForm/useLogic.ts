"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { capitalize } from "lodash";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

import { getAccounts } from "@/services/accounts";
import { getUsers } from "@/services/users";
import { signIn } from "@/utils/auth";


async function getAccountsForEmail(email: string) {
  const [user] = await getUsers({ email });
  if (!user) return [];
  return await getAccounts({ userId: user._id.toString() });
}


const LoginFormSchema = object({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: string().when("$formStep", {
    is: "email",
    then: schema => schema.optional(),
    otherwise: schema => schema.required("Please enter a password"),
  }),
});
export type LoginFormSteps = "email" | "login" | "register";
export type LoginFormData = InferType<typeof LoginFormSchema>;

export type UseLoginFormOptions = {
  callbackUrl: string,
  defaultValues?: Partial<LoginFormData>,
};

export default function useLoginForm({ defaultValues, callbackUrl }: UseLoginFormOptions) {
  const router = useRouter();

  const [formStep, setFormStep] = React.useState<LoginFormSteps>(defaultValues?.email ? "register" : "email");
  const handleBackToEmail = () => setFormStep("email");

  const form = useForm<LoginFormData>({
    mode: "all",
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: {
      email: defaultValues?.email ?? "",
      password: defaultValues?.password ?? "",
    },
    context: { formStep },
    resolver: yupResolver(LoginFormSchema),
  });

  const submitMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) => {
      if (formStep === "email") {
        const accounts = await getAccountsForEmail(email);
        if (!accounts.length) return setFormStep("register");

        if (!accounts.find(v => v.provider === "credentials")) {
          // TODO: Handle highlighting the provider account buttons
          throw new Error(`This account doesn't have a password. Use one of the following sign in methods: ${accounts.map(item => capitalize(item.provider)).join(", ")}`)
        }

        return setFormStep("login");
      }

      try {
        await signIn({ email, password: password! });
      }
      catch (err) {
        console.error(err)
        throw new Error((err === "CredentialsSignin" && formStep === "login") ? "Incorrect email or password" : "An error occured. Please try again");
      }

      return router.push(callbackUrl);
    }
  });

  return {
    form,
    submitMutation,
    formStep,
    setFormStep,
    handleBackToEmail,
  };
}