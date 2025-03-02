"use client";

import { useActionState, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Checkbox, FormControlLabel, Skeleton, Stack, Typography } from "@mui/material";

import { allowSelectedCookies } from "./actions";
import { CATEGORIES } from "./constants";
import { getAllCategories, getDefaultCategories } from "./helpers";
import { CookieConsentContext } from "./Provider";
import FormSubmit from "@/components/ui/FormSubmit";


export default function CookieConsentForm() {
  const { setCustomize, consent, revalidateConsent } = useContext(CookieConsentContext);

  const [defaultSelected, setDefaultSelected] = useState<string[]>();

  useEffect(
    () => {
      if (defaultSelected) return;
      setDefaultSelected(consent ?? getDefaultCategories());
    },
    [defaultSelected, consent]
  )


  const [result, saveAction] = useActionState(
    async (prevResult: unknown, formData: FormData) => {
      const categories = formData.getAll("categories");
      if (!categories.every((item): item is string => typeof item === "string")) return { error: "Invalid selection" };

      await allowSelectedCookies(categories);

      revalidateConsent();
      setCustomize(false);

      return {};
    },
    {}
  );

  const handleCancel = () => setCustomize(false);

  useEffect(
    () => {
      if (!result?.error) return;

      const id = toast(
        ({ closeToast }) => <Alert severity="error" onClose={() => closeToast()}>{result.error}</Alert>,
        { autoClose: 5000 }
      );

      return () => toast.dismiss(id);
    },
    [result]
  );

  return (
    <form action={saveAction} style={{ display: "contents" }}>
      <Stack alignItems="flex-start">
        <Typography variant="body2">
          Select the types of cookies you want to allow.
        </Typography>

        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={.5} width="100%">
          {
            getAllCategories().map(cat => (
              <FormControlLabel
                key={cat}
                control={
                  defaultSelected
                    ? (
                      <Checkbox
                        name="categories"
                        size="small"
                        value={cat}
                        defaultChecked={defaultSelected.includes(cat)}
                        disabled={CATEGORIES[cat].readOnly}
                      />
                    )
                    : <Skeleton><Checkbox size="small" /></Skeleton>
                }
                label={cat}
                sx={{ textTransform: "capitalize" }}
              />
            ))
          }
        </Box>
      </Stack>

      <Stack direction="row-reverse" spacing={1}>
        <FormSubmit
          renderSubmit={status => (
            <LoadingButton
              type="submit"
              variant="contained"
              loading={status.pending}
              sx={{ whiteSpace: "nowrap" }}
            >
              Save
            </LoadingButton>
          )}
        />

        <Button
          type="button"
          onClick={handleCancel}
          sx={{ whiteSpace: "nowrap" }}
        >
          Cancel
        </Button>
      </Stack>
    </form>
  );
}