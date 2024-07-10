"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import { loginEmailAction, loginPasswordAction } from "./action";
import LoginFormEmailInput from "./inputs/Email";
import LoginFormPasswordInput from "./inputs/Password";
import LoginFormSubmitInput from "./inputs/Submit";

const Alert = dynamic(() => import("@mui/material/Alert"), { ssr: false });


export const LoginFormSchema = object({
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

export type LoginFormProps = {
  callbackUrl?: string,
  error?: string,
  defaultValues?: Partial<LoginFormData>,
};

export default function LoginForm({
  callbackUrl = "/account",
  error,
  defaultValues,
  ...props
}: LoginFormProps) {
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

  const [pending, startTransition] = React.useTransition();

  const handleSubmit = async (formData: FormData) => {
    const { email, password } = await LoginFormSchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { formStep } },
    );

    if (formStep === "email") {
      const nextStep = await loginEmailAction({ email });
      setFormStep(nextStep);
    }
    else {
      await loginPasswordAction({ email, password: password! });
      router.push(callbackUrl);
    }
  }

  const email = form.watch("email");


  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
      {...props}
    >
      {
        formStep !== "email" && (
          <Button
            startIcon={<KeyboardArrowLeftRounded />}
            onClick={handleBackToEmail}
          >
            Back
          </Button>
        )
      }

      <Box>
        {
          formStep === "email" && (
            <Typography
              component="h1"
              variant="h3"
            >
              Log in or sign up
            </Typography>
          )
        }

        {
          formStep !== "email" && (
            <>
              <Typography
                component="p"
                variant="h3"
              >
                {formStep === "register" ? "Sign up for free" : "Welcome back!"}
              </Typography>

              <Typography
                component="p"
                variant="body2"
                color="text.secondary"
              >
                {formStep === "register" ? "Creating acount for" : "Logging in as"} {email}
              </Typography>
            </>
          )
        }
      </Box>

      <form
        action={
          formData => startTransition(() => handleSubmit(formData))
        }
        style={{ width: "100%" }}
      >
        <Stack pt={2} spacing={4}>
          <Box>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                formStep === "email"
                  ? (
                    <LoginFormEmailInput
                      fieldState={fieldState}
                      {...field}
                    />
                  )
                  : <input type="hidden" {...field} />
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                formStep !== "email"
                  ? (
                    <LoginFormPasswordInput
                      isNew={formStep === "register"}
                      fieldState={fieldState}
                      {...field}
                    />
                  )
                  : <input type="hidden" {...field} />
              )}
            />
          </Box>

          <Stack spacing={2}>
            {
              !!error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )
            }

            {
              form.formState.errors.root && (
                <Alert severity="error">
                  {form.formState.errors.root?.message || "An error occurred. Please try again"}
                </Alert>
              )
            }
          </Stack>

          <LoginFormSubmitInput
            loading={pending}
            submitText={
              formStep == "register"
                ? "Sign up"
                : formStep === "login"
                ? "Login"
                : "Continue with email"
            }
          />
        </Stack>
      </form>
    </Stack>
  );
}