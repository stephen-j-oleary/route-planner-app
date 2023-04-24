import { Button, Stack } from "@mui/material";

import providerLogos from "@/shared/utils/auth/providerLogos";


export default function ProvidersList({
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
                Sign In with {name}
              </Button>
            );
          })
      }
    </Stack>
  );
}