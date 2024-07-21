import React from "react"
import { FormStatus, useFormStatus } from "react-dom";


export type FormSubmitProps = {
  renderSubmit: (status: FormStatus) => React.ReactNode,
};


export default function FormSubmit({
  renderSubmit,
}: FormSubmitProps) {
  const status = useFormStatus();

  return renderSubmit(status);
}