import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import YupPassword from "yup-password";

import { LoadingButton } from "@mui/lab";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Stack } from "@mui/material";

import SignInFormPasswordInput from "../SignInForm/inputs/PasswordInput";
import DeleteAccount from "@/components/Users/DeleteAccount";
import useDeferred from "@/shared/hooks/useDeferred";
import { useGetAccounts, useUpdateAccountCredentialsById } from "@/shared/reactQuery/useAccounts";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";

YupPassword(yup);


export default function UserAuthForm() {
  const authUser = useGetSession({ select: selectUser });

  const account = useGetAccounts({
    select: data => data.find(item => item.provider === "credentials"),
  });

  const defaultValues = useDeferred(
    [!!account.data],
    {
      id: account.data?._id,
      oldCredentials: {
        email: account.data?.credentials.email,
        password: "",
      },
      email: account.data?.credentials.email,
      password: "",
    }
  );

  const schema = yup.object().shape({
    "oldCredentials.password": yup.string().required(),
    password: yup
      .string()
      .required()
      .password()
      .minSymbols(0),
  });

  const changePasswordForm = useForm({
    mode: "all",
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: defaultValues.execute,
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const handleShowChangePassword = () => setShowChangePassword(true);
  const handleHideChangePassword = () => {
    setShowChangePassword(false);
    handleChangePassword.reset();
  };

  const handleChangePassword = useUpdateAccountCredentialsById();


  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
      width="100%"
      paddingX={1}
    >
      {
        account.isLoading ? (
          <Skeleton variant="rounded">
            <Button size="small">Change password</Button>
          </Skeleton>
        ) : account.isError ? (
          <Alert severity="error">
            An error occured while loading
          </Alert>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={handleShowChangePassword}
            >
              Change password...
            </Button>

            <Dialog
              fullWidth
              maxWidth="xs"
              open={showChangePassword}
              onClose={handleHideChangePassword}
            >
              <form
                onSubmit={changePasswordForm.handleSubmit(
                  data => {
                    handleChangePassword.mutateAsync(data)
                      .then(handleHideChangePassword)
                      .catch(() => {}); // Prevent unhandled error message
                  }
                )}
              >
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                  <Stack
                    spacing={2}
                    paddingY={1}
                  >
                    <SignInFormPasswordInput
                      form={changePasswordForm}
                      name="oldCredentials.password"
                      schema={schema}
                      label="Current Password"
                    />

                    <SignInFormPasswordInput
                      form={changePasswordForm}
                      name="password"
                      schema={schema}
                      label="New Password"
                      isNew
                    />

                    {
                      handleChangePassword.isError && (
                        <Alert severity="error">
                          {handleChangePassword.error.response?.data?.message || "An error occurred. Please try again"}
                        </Alert>
                      )
                    }
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button type="button" onClick={handleHideChangePassword}>Cancel</Button>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loadingPosition="center"
                    loading={handleChangePassword.isLoading}
                  >
                    Change Password
                  </LoadingButton>
                </DialogActions>
              </form>
            </Dialog>
          </>
        )
      }

      <DeleteAccount
        variant="outlined"
        size="small"
        disabled={!authUser.isFetched}
      />
    </Stack>
  );
}