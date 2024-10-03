"use server";

import VerifyFormSchema from "./schema";
import { getVerifyUser } from "@/app/api/user/verify/[code]/actions";


export default async function verifyUser(prevState: unknown, formData: FormData) {
  try {
    const { code } = await VerifyFormSchema.validate(Object.fromEntries(formData.entries()));

    await getVerifyUser(code);

    return { success: true };
  }
  catch (err) {
    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}