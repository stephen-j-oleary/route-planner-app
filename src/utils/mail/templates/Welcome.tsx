import { Body, Head, Heading, Html, Preview, Text } from "@react-email/components";


export type VerificationEmailProps = {
  variant?: "welcome" | "verification" | "password",
  verificationCode: string,
  supportEmail: string,
};

export default function VerificationEmail({
  variant = "welcome",
  verificationCode,
  supportEmail,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Content-Type" content="text/html charset=UTF-8" />
      </Head>

      <Preview>
        {
          variant === "welcome"
            ? "Welcome to Loop Mapping"
            : `Your code is ${verificationCode}`
        }
      </Preview>

      <Body>
        <Text>
          {variant === "welcome" && `Welcome to Loop Mapping! We're thrilled to have you on board.`}
          {
            variant === "password"
              ? "To change your password, please verify your account by entering the following code:"
              : "To ensure the security of your account, please verify your email address by entering the following verification code:"
          }
        </Text>

        <Text id="code"><strong>{verificationCode}</strong></Text>

        {
          variant !== "password" && (
            <>
              <Heading as="h2">How to complete the verification process:</Heading>

              <ol>
                <li>Log in to your Loop Mapping account.</li>
                <li>Navigate to the account settings page.</li>
                <li>Enter the provided verification code.</li>
              </ol>

              <Text>
                {`Once you've completed these steps, you're ready to start using Loop Mapping for all your deliveries and trips.`}
              </Text>
            </>
          )
        }

        <Text>Best regards,</Text>
        <Text>The Loop Mapping Team</Text>
        <Text>{supportEmail}</Text>
      </Body>
    </Html>
  );
}