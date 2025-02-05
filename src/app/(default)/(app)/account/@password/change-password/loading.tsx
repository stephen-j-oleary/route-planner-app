import { Button, DialogActions, DialogContent, Skeleton, TextField } from "@mui/material";

export default function Loading() {
  return (
    <>
      <DialogContent>
        <Skeleton>
          <TextField fullWidth />
        </Skeleton>
      </DialogContent>

      <DialogActions>
        <Skeleton>
          <Button>Cancel</Button>
        </Skeleton>
        <Skeleton>
          <Button>Continue</Button>
        </Skeleton>
      </DialogActions>
    </>
  );
}