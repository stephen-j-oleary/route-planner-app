import { isObject } from "lodash-es";
import { PopupState } from "material-ui-popup-state/hooks";
import React, { useState } from "react";

import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";

import ConfirmationDialog, { ConfirmationDialogProps } from "@/components/ui/ConfirmationDialog";


type DialogState = { popupState: PopupState };
type Option =
  | string
  | {
    primary: React.ReactNode,
    secondary?: React.ReactNode,
    value: string,
  };

export type SelectDialogProps =
  & Omit<ConfirmationDialogProps, "renderConfirmButton" | "renderCancelButton" | "defaultValue">
  & {
    renderConfirmButton: (value: string, dialogState: DialogState) => React.ReactNode,
    renderCancelButton?: (value: string, dialogState: DialogState) => React.ReactNode,
    options: Option[],
    value?: string,
    onChange?: (value: string) => void,
    defaultValue?: string,
  };

export default function SelectDialog({
  renderConfirmButton,
  renderCancelButton,
  options,
  value,
  onChange,
  defaultValue,
  children,
  ...props
}: SelectDialogProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);


  return (
    <ConfirmationDialog
      renderConfirmButton={(...args) => renderConfirmButton?.(value ?? internalValue ?? "", ...args)}
      renderCancelButton={(...args) => renderCancelButton?.(value ?? internalValue ?? "", ...args)}
      {...props}
    >
      {children}

      {
        options && (
          <RadioGroup
            name="options"
            value={value ?? internalValue}
            onChange={e => (onChange ?? setInternalValue)(e.target.value)}
            sx={{ paddingY: 2 }}
          >
            {
              options.map(opt => (
                <FormControlLabel
                  key={isObject(opt) ? opt.value : opt}
                  value={isObject(opt) ? opt.value : opt}
                  control={<Radio />}
                  label={(isObject(opt) && opt.secondary)
                    ? (
                      <>
                        <Typography component="span" variant="body1">
                          {opt.primary}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ pl: .5 }}>
                          {opt.secondary}
                        </Typography>
                      </>
                    )
                    : (isObject(opt) ? opt.primary : opt)}
                  sx={{ marginY: 1 }}
                />
              ))
            }
          </RadioGroup>
        )
      }
    </ConfirmationDialog>
  );
}