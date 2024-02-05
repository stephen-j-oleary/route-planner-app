/** @jest-environment node */

import nmHandlebars from "nodemailer-express-handlebars";

import createMailClient from "@/utils/mail/client";

jest.mock("nodemailer-express-handlebars");

const mockedNmHandlebars = nmHandlebars as jest.Mock;


describe("mailClient", () => {
  beforeEach(() => jest.clearAllMocks());

  it("Rejects when missing template", () => {
    mockedNmHandlebars.mockReturnValueOnce((_: unknown, cb: (err: unknown) => void) => cb(new Error("No such file or directory")));

    expect(createMailClient().sendMail({})).rejects.toHaveProperty("message", expect.stringMatching(/no such file/i));
  })

  it("Rejects when missing from email", () => {
    const config = { to: "email@example.com" };

    expect(createMailClient().sendMail(config)).rejects.toHaveProperty("message", expect.stringMatching(/invalid from/i));
  })

  it("Rejects when missing recipient", () => {
    const config = { from: "email@example.com" };

    expect(createMailClient().sendMail(config)).rejects.toHaveProperty("message", expect.stringMatching(/no recipients/i));
  })

  it("Is successful with correct config", () => {
    const email = "email@example.com";
    const config = {
      to: email,
      from: email,
      subject: "Test email",
      template: "test",
    };

    const promise = createMailClient().sendMail(config);

    expect(promise).resolves.toHaveProperty("accepted", expect.arrayContaining([email]));
    expect(promise).resolves.toHaveProperty("response", expect.stringMatching(/ok/i));
    expect(promise).resolves.toHaveProperty("envelope", expect.objectContaining({
      from: email,
      to: expect.arrayContaining([email]),
    }));
  })
})