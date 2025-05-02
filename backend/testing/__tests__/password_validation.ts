import { password_check, password_hash } from "../../src/auth/password";

describe("password authentication", () =>
{
    const PASSWORD = "super_password";
    const BAD_PASSWORD = "not_super_password";

    let hashed = "";

    it("should hash a password", async () =>
    {
        hashed = await password_hash(PASSWORD);
        expect(hashed).not.toBeFalsy();
    });

    it("should validate hash against original password", async () =>
    {
        const valid = await password_check(hashed, PASSWORD);
        expect(valid).toBe(true);
    });

    it("should not validate hash against invalid password", async () =>
    {
        const valid = await password_check(hashed, BAD_PASSWORD);
        expect(valid).toBe(false);
    })
})