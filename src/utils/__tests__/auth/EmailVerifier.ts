/** @jest-environment node */

import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import createMailClient from "@/utils/mail/client";

jest.mock("@/utils/mail/client");

const mockedVTDeleteMany = jest.fn(),
      mockedVTCreate = jest.fn(),
      mockedVTFindOne = jest.fn(),
      mockedVTFindOneAndDelete = jest.fn(),
      mockedUFindOneAndUpdate = jest.fn();

function setupVerifier() {
  return EmailVerifier({
    dbConnect: Promise.resolve(),
    models: { User, VerificationToken },
    mailFrom: "mail@from.com",
  });
}

describe("EmailVerifier", () => {
  let token: string, user: { email: string };

  beforeEach(() => {
    token = "TOKEN";
    user = { email: "example@email.com" };

    VerificationToken.deleteMany = mockedVTDeleteMany.mockResolvedValue({});
    VerificationToken.create = mockedVTCreate.mockResolvedValue({ token });
    VerificationToken.findOne = mockedVTFindOne.mockResolvedValue({
      expires: Date.now() + 1000 * 60 // 1 minute from now
    });
    VerificationToken.findOneAndDelete = mockedVTFindOneAndDelete.mockResolvedValue({});
    User.findOneAndUpdate = mockedUFindOneAndUpdate.mockResolvedValue({});
  })

  it("send flow removes old tokens", async () => {
    const verifier = setupVerifier();

    await verifier.send(user);

    return expect(mockedVTDeleteMany).toHaveBeenCalledWith({ identifier: user.email });
  })

  it("send flow creates a new token", async () => {
    const verifier = setupVerifier();

    await verifier.send(user);

    return expect(mockedVTCreate).toHaveBeenCalledWith({ identifier: user.email });
  })

  it("send flow sends an email", async () => {
    const mailClient = createMailClient();
    const verifier = setupVerifier();

    await verifier.send(user, "welcome");

    return expect(mailClient.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      subject: expect.stringMatching(/welcome to loop mapping/i),
      html: expect.stringMatching(/id="code".+[0-9A-Z]{5}/m),
    }));
  })

  it("verify returns false if token not found", async () => {
    mockedVTFindOne.mockResolvedValueOnce(null);
    const verifier = setupVerifier();

    const result = await verifier.verify(user, token);

    expect(result).toBe(false);
  })

  it("verify returns false if expired token found", async () => {
    mockedVTFindOne.mockResolvedValueOnce({
      expires: Date.now() - 1000 * 60 // 1 minute ago
    });
    const verifier = setupVerifier();

    const result = await verifier.verify(user, token);

    expect(result).toBe(false);
  })

  it("verify returns true if unexpired token found", async () => {
    mockedVTFindOne.mockResolvedValue({
      expires: Date.now() + 1000 * 60 // 1 minute from now
    });
    const verifier = setupVerifier();

    const result = await verifier.verify(user, token);

    expect(result).toBe(true);
  })

  it("verify deletes any tokens found", async () => {
    const verifier = setupVerifier();

    await verifier.verify(user, token);

    expect(mockedVTFindOneAndDelete).toHaveBeenCalledWith({ identifier: user.email, token });
  })

  it("verify sets user verified if token is valid", async () => {
    const verifier = setupVerifier();

    await verifier.verify(user, token);

    expect(mockedUFindOneAndUpdate).toHaveBeenCalledWith({ email: user.email }, { $set: { emailVerified: expect.any(Number) } });
  })
})