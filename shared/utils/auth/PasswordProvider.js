import { getToken } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";


export default function PasswordProvider(
  dbConnect,
  models
) {
  return CredentialsProvider({
    id: "credentials",
    name: "Password",
    credentials: {
      username: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize({ email, password }, req) {
      try {
        await dbConnect;

        // Find or create the user
        const user = (
          await models.user.findOne({ email }).lean().exec()
          ?? (await models.user.create({ email })).toJSON()
        );

        const accounts = await models.account.find({ userId: user._id }).exec();
        const credentialsAccount = accounts.find(acc => acc.type === "credentials");
        const token = await getToken({ req });
        const authUser = token?.email && await models.user.findOne({ email: token.email }).exec();

        if (credentialsAccount) {
          return (await credentialsAccount.checkCredentials({ email, password }))
            ? user
            : null;
        }

        if (accounts.length && authUser?._id !== user._id) return null;

        const account = await models.account.create({
          type: "credentials",
          provider: "credentials",
          userId: user._id,
          credentials: { email, password },
        });
        if (!account) throw new Error("Account creation failed");

        return user;
      }
      catch (err) {
        return null;
      }
    }
  });
}