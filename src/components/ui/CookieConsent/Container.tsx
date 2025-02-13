import { ReactNode } from "react";

import { CookieRounded } from "@mui/icons-material";
import { Alert, Container, Slide } from "@mui/material";


export default function CookieConsentContainer({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        position: "fixed",
        pb: 2,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)"
      }}
    >
      <Slide in direction="up">
        <Alert
          severity="info"
          icon={<CookieRounded />}
          slotProps={{
            message: {
              sx: {
                flex: "1 0 0",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                alignItems: "flex-end",
                rowGap: 2,
              },
            },
          }}
        >
          {children}
        </Alert>
      </Slide>
    </Container>
  );
}