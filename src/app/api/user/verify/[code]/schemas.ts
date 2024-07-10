import { getVerifyUser } from "./actions";


export type ApiGetVerifyUserResponse = Awaited<ReturnType<typeof getVerifyUser>>;