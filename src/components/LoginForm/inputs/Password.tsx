import "client-only";

import { useMemo, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, IconButton, InputAdornment, Stack, TextField, TextFieldProps, Tooltip, Typography } from "@mui/material";

import SplitLinearProgress from "@/components/ui/SplitLinearProgress";
import passwordStrength from "@/utils/passwordStrength";


const STRENGTH_COLORS = ["error", "error", "warning", "success", "success"] as const;


export type LoginFormPasswordInputProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: string,
    onChange: (value: string) => void,
    isNew?: boolean,
  };


export default function LoginFormPasswordInput({
  value,
  onChange,
  isNew = false,
  label = isNew ? "Create a Password" : "Password",
  ...props
}: LoginFormPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(
    () => passwordStrength(value || ""),
    [value]
  );

  const field = (
    <TextField
      value={value ?? ""}
      onChange={e => onChange(e.currentTarget.value ?? "")}
      label={label}
      type={showPassword ? "text" : "password"}
      autoComplete={isNew ? "new-password" : "current-password"}
      fullWidth
      variant="outlined"
      size="small"
      {...props}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props.slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                <IconButton
                  aria-label="Show password"
                  role="switch"
                  aria-checked={showPassword}
                  onClick={() => setShowPassword(v => !v)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
    />
  );

  return isNew
    ? (
      <Stack spacing={1}>
        {field}

        <Box>
          <SplitLinearProgress
            value={strength.score * 25}
            color={STRENGTH_COLORS[strength.score || 0]}
            segmentCount={4}
          />

          <Typography
            variant="caption"
          >
            &nbsp;{strength.feedback?.warning || ""}
          </Typography>
        </Box>
      </Stack>
    )
    : field;
}