import { useState } from "react";

import LoginFormView from "@/components/LoginForm/View";


export type LoginFormData = {
  email: string,
  password: string,
};

export default function LoginForm() {
  const [formStep, setFormStep] = useState<"email" | "login" | "register">("email");
  const [data, setData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  return (
    <LoginFormView
      data={data}
      setData={setData}
      formStep={formStep}
      setFormStep={setFormStep}
    />
  );
}