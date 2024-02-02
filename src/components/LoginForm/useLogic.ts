import { yupResolver } from "@hookform/resolvers/yup";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { InferType, object, string } from "yup";

import useRouterQuery from "@/hooks/useRouterQuery";
import { useGetProviders } from "@/reactQuery/useProviders";
import { getAccounts } from "@/services/accounts";
import { getUsers } from "@/services/users";


async function getAccountsForEmail(email: string) {
  const users = await getUsers({ email });
  if (!users.length) return [];

  return await getAccounts({ userId: users[0]!._id.toString() });
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
  const queryRouter = useRouterQuery();

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
      queryRouter.set("error", undefined);

      if (formStep === "email") {
        const accounts = await getAccountsForEmail(email);
        if (!accounts.length) return setFormStep("register");

        if (!accounts.find(v => v.provider === "credentials")) {
          // TODO: Handle highlighting the provider account buttons
          throw new Error(`This account doesn't have a password. Use one of the following sign in methods: ${accounts.map(item => capitalize(item.provider)).join(", ")}`)
        }

        return setFormStep("login");
      }

      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res?.ok){
        console.error(res?.error)
        throw new Error((res?.error === "CredentialsSignin" && formStep === "login") ? "Incorrect email or password" : "An error occured. Please try again");
      }

      return router.push(callbackUrl);
    }
  });

  const providers = useGetProviders({
    select: data => Object.values(data ?? {}).filter(item => item.id !== "credentials" && item.id !== "email"),
  });

  return {
    form,
    submitMutation,
    formStep,
    setFormStep,
    handleBackToEmail,
    providers,
  };
}