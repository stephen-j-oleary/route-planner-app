import { redirect } from "next/navigation";

import LoginFormEmailStep from "./steps/Email";
import LoginFormPasswordStep from "./steps/Password";
import { appendQuery } from "@/utils/url";
import pages from "pages";


export type LoginFormProps = {
  callbackUrl: string,
  step: string,
  defaultEmail?: string,
};

export default function LoginForm({
  callbackUrl,
  step,
  defaultEmail,
}: LoginFormProps) {
  if (step !== "email" && !defaultEmail) redirect(appendQuery(pages.login, { callbackUrl }));


  return step === "email"
    ? (
      <LoginFormEmailStep
        callbackUrl={callbackUrl}
        defaultEmail={defaultEmail}
      />
    ) : (
      <LoginFormPasswordStep
        step={step}
        callbackUrl={callbackUrl}
        defaultEmail={defaultEmail!}
      />
    );
}