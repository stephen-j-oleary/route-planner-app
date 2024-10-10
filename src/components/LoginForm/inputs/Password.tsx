import "client-only";

import { bindHover, bindMenu, usePopupState } from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import React from "react";

import { InfoRounded, Visibility, VisibilityOff } from "@mui/icons-material";
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
    isNew?: boolean,
  };


export default function LoginFormPasswordInput({
  value,
  onChange,
  isNew = false,
  label = isNew ? "Create a Password" : "Password",
  ...props
}: LoginFormPasswordInputProps) {
  const passwordStrengthPopup = usePopupState({
    popupId: "passsword-strength",
    variant: "dialog",
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const strength = React.useMemo(
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
}