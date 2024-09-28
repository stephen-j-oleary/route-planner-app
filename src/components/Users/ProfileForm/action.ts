"use server";

import { patchUser } from "@/app/api/user/actions";
import { IUser } from "@/models/User";
import { UserProfileSchema } from "@/models/User/schemas";


export type UserProfileFormState = {
  updatedUser?: IUser | undefined,
  error?: string,
};

export default async function userProfileSubmit(
  prevState: UserProfileFormState,
  formData: FormData,
): Promise<UserProfileFormState> {
  try {
    const data = await UserProfileSchema.validate(Object.fromEntries(formData.entries()));

    const updatedUser = await patchUser(data);

    return { updatedUser };
  }
  catch (err) {
    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}