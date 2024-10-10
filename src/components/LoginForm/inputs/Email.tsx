import { TextField, TextFieldProps } from "@mui/material";


export type LoginFormEmailInputProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: string,
    onChange: (value: string) => void,
  };


export default function LoginFormEmailInput({
  value,
  onChange,
  label = "Email",
  ...props
}: LoginFormEmailInputProps) {
  return (
    <TextField
      value={value ?? ""}
      onChange={e => onChange(e.currentTarget.value ?? "")}
      label={label}
      type="email"
      fullWidth
      variant="outlined"
      size="small"
      {...props}
    />
  );
}