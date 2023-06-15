const { useForm } = jest.requireActual("react-hook-form");

/**
 * Returns a mock instance of useForm that will hold the given formState, values and errors
 * @param {{ optionReplacements: import("react-hook-form").UseFormProps } & import("react-hook-form").UseFormReturn} state The mocked state of the form
 * @returns {import("react-hook-form").UseFormReturn}
 */
export default function createUseFormMock({ optionReplacements = {}, ...replacements } = {}) {
  return (options = {}) => ({
    ...useForm({
      ...options,
      ...optionReplacements,
    }),
    ...replacements,
  });
}