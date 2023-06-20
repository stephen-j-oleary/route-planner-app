import { Button, Stack } from "@mui/material";

import providerLogos from "@/shared/utils/auth/providerLogos";


export default function ProvidersList({
  actionText = "Sign in with",
  providers = [],
  handleProviderSubmit,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="stretch"
      sx={{ width: "100%" }}
    >
      {
        providers
          .filter(({ id }) => !["credentials", "email"].includes(id))
          .map(({ id, name }) => {
            const LogoComponent = providerLogos[id];

            return (
              <Button
                key={id}
                onClick={() => handleProviderSubmit(id)}
                variant="outlined"
                size="large"
                color="inherit"
                startIcon={LogoComponent && <LogoComponent />}
              >
                {actionText} {name}
              </Button>
            );
          })
      }
    </Stack>
  );
}