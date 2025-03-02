"use client";

import NextLink from "next/link";
import { useContext, useEffect, useTransition } from "react";

import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Link, Stack, Typography } from "@mui/material";

import { allowAllCookies, denyAllCookies } from "./actions";
import CookieConsentContainer from "./Container";
import CookieConsentForm from "./Form";
import { CookieConsentContext } from "./Provider";
import pages from "@/pages";


export default function CookieConsentBanner() {
  const { ready, show, setShow, customize, setCustomize, consent, revalidateConsent } = useContext(CookieConsentContext);

  useEffect(
    () => {
      if (!ready) return;
      setShow(!consent);
    },
    [ready, consent, setShow]
  );


  const [isAllowAllPending, startAllowAllTransition] = useTransition();
  const handleAllowAll = () => startAllowAllTransition(async () => {
    await allowAllCookies();
    revalidateConsent();
  });

  const [isDenyAllPending, startDenyAllTransition] = useTransition();
  const handleDenyAll = () => startDenyAllTransition(async () => {
    await denyAllCookies();
    revalidateConsent();
  });

  const handleCustomize = () => setCustomize(true);


  return (
    <>
      {
        (show && !customize) && (
          <CookieConsentContainer>
            <Stack alignItems="flex-start">
              <Typography variant="body2">
                We use cookies to analyze website traffic and serve personalized ads. Learn more on our <Link component={NextLink} href={pages.cookies}>Cookie Policy</Link> page.
              </Typography>

              <Button
                size="small"
                endIcon={<KeyboardArrowRightRounded />}
                onClick={handleCustomize}
                sx={{ whiteSpace: "nowrap" }}
              >
                Customize
              </Button>
            </Stack>

            <Stack direction="row-reverse" spacing={1}>
              <LoadingButton
                variant="contained"
                loading={isAllowAllPending}
                onClick={handleAllowAll}
                sx={{ whiteSpace: "nowrap" }}
              >
                Allow all
              </LoadingButton>

              <LoadingButton
                loading={isDenyAllPending}
                onClick={handleDenyAll}
                sx={{ whiteSpace: "nowrap" }}
              >
                Deny
              </LoadingButton>
            </Stack>
          </CookieConsentContainer>
        )
      }

      {
        customize && (
          <CookieConsentContainer>
            <CookieConsentForm />
          </CookieConsentContainer>
        )
      }
    </>
  );
}