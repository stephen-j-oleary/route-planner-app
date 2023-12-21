import React from "react";

import LoginFormEmailStep from "@/components/LoginForm/EmailStep";
import { LoginFormData } from "@/components/LoginForm/Logic";
import LoginFormLoginStep from "@/components/LoginForm/LoginStep";
import LoginFormRegisterStep from "@/components/LoginForm/RegisterStep";


export type LoginFormViewProps = {
  data: LoginFormData,
  setData: React.Dispatch<React.SetStateAction<LoginFormData>>,
  formStep: "email" | "login" | "register",
  setFormStep: React.Dispatch<React.SetStateAction<"email" | "login" | "register">>,
  callbackUrl: string,
};

export default function LoginFormView(props: LoginFormViewProps) {
  const { formStep } = props;

  if (formStep === "email") return <LoginFormEmailStep {...props} />;
  if (formStep === "login") return <LoginFormLoginStep {...props} />;
  if (formStep === "register") return <LoginFormRegisterStep {...props} />;
}