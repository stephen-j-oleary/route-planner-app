import { useState } from "react";

import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";

import ConfirmationDialog from "@/components/ConfirmationDialog";


export default function SelectDialog({
  renderConfirmButton,
  renderCancelButton,
  children,
  options,
  value,
  onChange,
  defaultValue = "",
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);


  return (
    <ConfirmationDialog
      renderConfirmButton={(...args) => renderConfirmButton?.(value ?? internalValue, ...args)}
      renderCancelButton={(...args) => renderCancelButton?.(value ?? internalValue, ...args)}
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
                  key={opt.value || opt}
                  value={opt.value || opt}
                  control={<Radio />}
                  label={opt.secondary
                    ? (
                      <>
                        <Typography component="span" variant="body1">
                          {opt.primary}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {opt.secondary}
                        </Typography>
                      </>
                    )
                    : (opt.primary || opt)}
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