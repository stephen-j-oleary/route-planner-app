/**
 * @jest-environment node
 */

import MailSlurp from "mailslurp-client";

import EmailVerification from "@/utils/auth/EmailVerification";

const apiKey = process.env.MAILSLURP_API_KEY;
if (!apiKey) throw new Error("Missing MailSlurp api key");

const mailslurp = new MailSlurp({ apiKey });

let inbox: Awaited<ReturnType<typeof mailslurp.createInbox>>;

describe("EmailVerification", () => {
  it("welcome flow works", async () => {
    inbox = await mailslurp.createInbox();
    const user = { email: inbox.emailAddress };

    await EmailVerification.welcome(user);
    const email = await mailslurp.waitForLatestEmail(inbox.id);

    expect(email.subject).toMatch(/welcome to loop mapping/i);
    expect(email.isHTML).toBe(true);

    const code = /id="code".+([0-9A-Z]{5})/m.exec(email.body!)?.[1];

    expect(typeof code).toBe("string");
    expect(code!.length).toBe(5);

    const result = await EmailVerification.verify(user, code!);
    expect(result).toBe(true);
  }, 10_000)

  it("resend should send am email", async () => {
    inbox = await mailslurp.createInbox();
    const user = { email: inbox.emailAddress };

    await EmailVerification.resend(user);
    const email = await mailslurp.waitForLatestEmail(inbox.id);

    expect(email.subject).toMatch(/loop mapping verification code/i);
    expect(email.isHTML).toBe(true);

    const code = /id="code".+([0-9A-Z]{5})/m.exec(email.body!)?.[1];

    expect(typeof code).toBe("string");
    expect(code!.length).toBe(5);

    const result = await EmailVerification.verify(user, code!);
    expect(result).toBe(true);
  }, 10_000)

  it("verify should be false for incorrect code", async () => {
    const user = { email: "randomEmail" };

    const result = await EmailVerification.verify(user, "code");
    expect(result).toBe(false);
  }, 10_000)
})