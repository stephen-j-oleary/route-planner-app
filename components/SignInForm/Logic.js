import { useRouter } from "next/router";
import { getProviders, signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import * as yup from "yup";
import YupPassword from "yup-password";

import SignInFormView from "@/components/SignInForm/View";
import { getAccountsProviders } from "@/shared/services/accounts";
import { getUsers } from "@/shared/services/users";

YupPassword(yup);

export const SIGN_IN_FORM_FIELD_NAMES = {
  email: "email",
  password: "password",
};

const DEFAULT_VALUES = {
  [SIGN_IN_FORM_FIELD_NAMES.email]: "",
  [SIGN_IN_FORM_FIELD_NAMES.password]: "",
};


export default function SignInForm({ message, error }) {
  const providers = useQuery({
    queryKey: ["providers"],
    queryFn: () => getProviders(),
    initialData: {},
  });

  const { query, push } = useRouter();
  const { callbackUrl } = query;

  const [internalError, setInternalError] = useState(null);
  const [formStep, setFormStep] = useState(0);
  const [isRegistered, setIsRegistered] = useState(null);

  const schema = yup.object().shape({
    [SIGN_IN_FORM_FIELD_NAMES.email]: yup
      .string()
      .required("This field is required")
      .email("Please enter a valid email"),
    [SIGN_IN_FORM_FIELD_NAMES.password]: isRegistered
      ? yup
        .string()
        .required("This field is required")
      : yup
        .string()
        .required()
        .password()
        .minSymbols(0)
  });

  const form = useForm({
    mode: "all",
    shouldUnregister: true,
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: DEFAULT_VALUES,
  });

  const handleProviderSubmit = id => signIn(id, { callbackUrl });

  const handleReturnToEmail = () => {
    if (formStep === 0) return;
    setInternalError(null);
    setFormStep(0);
    setIsRegistered(null);
  };

  const handleEmailSubmit = async params => {
    const users = await getUsers(params);

    setIsRegistered(users.length > 0);

    if (users.length > 0) {
      const accounts = await getAccountsProviders({ userId: users[0]._id });

      if (!accounts.find(v => v.provider === "credentials")) {
        throw new Error(`Please sign in using one of the following providers: ${accounts.map(item => item.provider).join(", ")}`);
      }
    }

    setFormStep(1);
  };

  const handlePasswordSubmit = async data => {
    const { ok, error } = await signIn("credentials", { ...data, redirect: false });
    if (ok) return push(callbackUrl);
    if (error === "CredentialsSignin") return setInternalError("Invalid email or password");
    setInternalError("An error occured. Please try again");
  };

  const handleCredentialsSubmit = async ({ email, password }) => {
    setInternalError(null);
    try {
      if (formStep === 0) await handleEmailSubmit({ email });
      if (formStep === 1) await handlePasswordSubmit({ email, password });
    }
    catch ({ message }) {
      setInternalError(message);
    }
  };

  const getProvidersListProps = () => ({
    providers: Object.values(providers.data || {}),
    handleProviderSubmit: handleProviderSubmit,
  });

  const getInputProps = name => ({
    form,
    name,
    schema,
    ...(name === SIGN_IN_FORM_FIELD_NAMES.email ? { isRegistered } : {}),
    ...(name === SIGN_IN_FORM_FIELD_NAMES.password ? { isNew: !isRegistered } : {}),
    ...(name === SIGN_IN_FORM_FIELD_NAMES.email ? { onClick: handleReturnToEmail } : {}),
    InputProps: {
      readOnly: (name === SIGN_IN_FORM_FIELD_NAMES.email && formStep !== 0),
    },
  });

  const getSubmitProps = () => ({
    loading: form.formState.isSubmitting,
    onClick: form.handleSubmit(handleCredentialsSubmit),
    submitText: `${(formStep > 0 && !isRegistered) ? "Create account" : "Sign In"} with Email`,
  });

  return (
    <SignInFormView
      message={message}
      errors={[
        error,
        internalError
      ].filter(v => v)}
      formStep={formStep}
      getProvidersListProps={getProvidersListProps}
      getInputProps={getInputProps}
      getSubmitProps={getSubmitProps}
    />
  );
}