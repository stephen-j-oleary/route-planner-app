"use client";

import React from "react";

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
  const [email, setEmail] = React.useState(defaultEmail ?? "");
  const [formStep, setFormStep] = React.useState(defaultEmail ? "register" : "email");
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