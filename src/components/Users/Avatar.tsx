import { Avatar } from "@mui/material";

import { AuthData } from "@/utils/auth";


export type UserAvatarProps = {
  session: AuthData,
};

export default function UserAvatar({
  session,
}: UserAvatarProps) {
  return (
    <Avatar
      src={session.image}
      sx={{ width: 40, height: 40 }}
    />
  );
}