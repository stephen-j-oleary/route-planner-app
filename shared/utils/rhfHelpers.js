export function getAllErrorsMessage(errors) {
  const [firstErrorField, firstError] = Object.entries(errors)[0];

  if (!Array.isArray(firstError)) return `${firstErrorField}: ${firstError.message}`;

  const firstErrorValues = Object.entries(firstError)
    .filter(([, err]) => !!err)
    .map(([index, err]) => ({ index: +index + 1, message: err.value.message }));

  const sameErrors = firstErrorValues
    .filter(({ message }) => message === firstErrorValues[0].message);

  return `${firstErrorField} ${sameErrors.map(({ index }) => index).join(", ")}: ${sameErrors[0].message}`;
}