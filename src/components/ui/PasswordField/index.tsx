// Don't use "use client" here. This component is passed non-serializable props so shouldn't be the client-server boundary
import "client-only";

import { ChangeEvent, useMemo, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, IconButton, InputAdornment, Stack, TextField, TextFieldProps, Tooltip, Typography } from "@mui/material";

import SplitLinearProgress from "@/components/ui/SplitLinearProgress";
import passwordStrength from "@/utils/passwordStrength";


const STRENGTH_COLORS = ["error", "error", "warning", "success", "success"] as const;


export type PasswordFieldProps =
  & TextFieldProps
  & { isNew?: boolean };


export default function PasswordField({
  value,
  onChange,
  defaultValue,
  isNew = false,
  ...props
}: PasswordFieldProps) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const _value = typeof value !== "undefined"
    ? value
    : localValue;
  const _onChange = typeof onChange !== "undefined"
    ? onChange
    : ((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setLocalValue(e.currentTarget.value));

  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(
    () => passwordStrength(typeof _value === "string" ? _value : ""),
    [_value]
  );

  const field = (
    <TextField
      value={_value ?? ""}
      onChange={_onChange}
      type={showPassword ? "text" : "password"}
      autoComplete={isNew ? "new-password" : "current-password"}
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