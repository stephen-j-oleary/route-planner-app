"use client";

import { useState } from "react";

import LoginFormEmailStep from "./steps/Email";
import LoginFormPasswordStep from "./steps/Password";


export type LoginFormProps = {
  callbackUrl?: string,
  defaultEmail?: string,
};

export default function LoginForm({
  callbackUrl = "/account",
  defaultEmail,
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [formStep, setFormStep] = useState(defaultEmail ? "register" : "email");
  const handleBackToEmail = () => setFormStep("email");


  return formStep === "email"
    ? (
      <LoginFormEmailStep
        setEmail={setEmail}
        setNextStep={v => setFormStep(v)}
      />
    ) : (
      <LoginFormPasswordStep
        callbackUrl={callbackUrl}
        email={email}
        action={formStep}
        onBack={handleBackToEmail}
      />
    );
}