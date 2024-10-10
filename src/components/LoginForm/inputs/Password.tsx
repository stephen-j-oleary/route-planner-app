"use client";

import { bindHover, bindMenu, usePopupState } from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import React, { useState } from "react";
import { ControllerFieldState } from "react-hook-form";

import { InfoRounded } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, IconButton, InputAdornment, Stack, TextField, TextFieldProps, Tooltip, Typography } from "@mui/material";

import SplitLinearProgress from "@/components/ui/SplitLinearProgress";
import passwordStrength from "@/utils/passwordStrength";


const STRENGTH_NAMES = ["none", "weak", "ok", "strong", "very strong"];
const STRENGTH_COLORS = ["error", "error", "warning", "success", "success"] as const;


export type LoginFormPasswordInputProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: string,
    onChange: (value: string) => void,
    fieldState?: ControllerFieldState,
    isNew?: boolean,
  };

const LoginFormPasswordInput = React.forwardRef(function LoginFormPasswordInput({
  value,
  onChange,
  isNew = false,
  label = isNew ? "Create a Password" : "Password",
  fieldState,
  ...props
}: LoginFormPasswordInputProps, ref) {
  const passwordStrengthPopup = usePopupState({
    popupId: "passsword-strength",
    variant: "dialog",
  });

  const [showPassword, setShowPassword] = useState(false);

  const strength = React.useMemo(
    () => passwordStrength(value || ""),
    [value]
  );

  const field = (
    <TextField
      inputRef={ref}
      value={value ?? ""}
      onChange={e => onChange(e.currentTarget.value ?? "")}
      label={label}
      type={showPassword ? "text" : "password"}
      autoComplete={isNew ? "new-password" : "current-password"}
      fullWidth
      variant="outlined"
      size="small"
      error={fieldState?.invalid}
      helperText={fieldState?.error?.message || " "}
      {...props}
      InputProps={{
        ...props.InputProps,
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
      }}
    />
  );

  return isNew
    ? (
      <Stack>
        {field}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Box flexGrow={1}>
            <SplitLinearProgress
              value={strength.score * 25}
              color={STRENGTH_COLORS[strength.score || 0]}
              segmentCount={4}
            />

            <Typography
              variant="caption"
            >
              Password strength: {STRENGTH_NAMES[strength.score]}
            </Typography>
          </Box>

          {
            strength.feedback?.warning && (
              <>
                <IconButton
                  size="small"
                  onClick={() => passwordStrengthPopup.toggle()}
                  {...bindHover(passwordStrengthPopup)}
                >
                  <InfoRounded />
                </IconButton>

                <HoverMenu
                  {...bindMenu(passwordStrengthPopup)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Typography
                    variant="caption"
                  >
                    {strength.feedback.warning}
                  </Typography>
                </HoverMenu>
              </>
            )
          }
        </Stack>
      </Stack>
    )
    : field;
});

export default LoginFormPasswordInput;