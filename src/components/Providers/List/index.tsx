import { signIn } from "next-auth/react";
import { UseQueryResult } from "react-query";

import { Button, Skeleton, Stack } from "@mui/material";

import providerLogos from "@/utils/auth/providerLogos";


export type ProvidersListProps = {
  providersQuery: UseQueryResult<{ id: string, name: string }[] | undefined>,
  callbackUrl: string,
  actionText?: string,
};

export default function ProvidersList({
  providersQuery,
  callbackUrl,
  actionText = "Sign in with",
}: ProvidersListProps) {
  const handleClick = (id: string) => void signIn(id !== "credentials" ? id : undefined, { callbackUrl });

  const isLoading = !providersQuery.data && !providersQuery.isError;

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
          : providersQuery.data!.map(({ id, name }) => {
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