import { UseFormProps, UseFormReturn } from "react-hook-form";

const { useForm } = jest.requireActual("react-hook-form");

/**
 * Returns a mock instance of useForm that will hold the given formState, values and errors
 * @param {{ optionReplacements: import("react-hook-form").UseFormProps } & import("react-hook-form").UseFormReturn} state The mocked state of the form
 * @returns {import("react-hook-form").UseFormReturn}
 */
type CreateUseFormMockReplacements =
  & Partial<UseFormReturn>
  & { optionReplacements?: Partial<UseFormProps> };

export default function createUseFormMock({ optionReplacements = {}, ...replacements }: CreateUseFormMockReplacements = {}) {
  return (options: Partial<UseFormProps> = {}) => ({
    ...useForm({
      ...options,
      ...optionReplacements,
    }),
    ...replacements,
  });
}

type CreateFormStateReplacements = Partial<UseFormReturn["formState"]>;

export function createFormState(replacements: CreateFormStateReplacements = {}) {
  const res: UseFormReturn["formState"] = {
    isDirty: false,
    isLoading: false,
    isSubmitted: false,
    isSubmitSuccessful: false,
    isSubmitting: false,
    isValidating: false,
    isValid: true,
    disabled: false,
    submitCount: 0,
    defaultValues: {},
    dirtyFields: {},
    touchedFields: {},
    errors: {},
    ...replacements,
  };

  return res;
}