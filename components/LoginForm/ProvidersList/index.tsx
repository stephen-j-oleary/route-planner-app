import { signIn } from "next-auth/react";

import { Button, Skeleton, Stack } from "@mui/material";

import { useGetProviders } from "@/shared/reactQuery/useProviders";
import providerLogos from "@/shared/utils/auth/providerLogos";


export type ProvidersListProps = {
  callbackUrl: string,
  actionText?: string,
};

export default function ProvidersList({
  callbackUrl,
  actionText = "Sign in with",
}: ProvidersListProps) {
  const providers = useGetProviders();
  const handleClick = (id: string) => signIn(id, { callbackUrl });

  const isLoading = providers.isIdle || (providers.isLoading && !providers.data);

  return (
    <Stack
      spacing={2}
      alignItems="stretch"
      sx={{ width: "100%" }}
      aria-busy={isLoading}
    >
      {
        isLoading
          ? <Skeleton width="100%"><Button size="large">.</Button></Skeleton>
          : Object.values(providers.data || {})
            .filter(({ id }) => !["credentials", "email"].includes(id))
            .map(({ id, name }) => {
              const LogoComponent = providerLogos[id];

              return (
                <Button
                  key={id}
                  onClick={() => handleClick(id)}
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