import { DB_User } from "@srcbox/library"
import { jwt_create_login_token, jwt_verify_login_token } from "../../src/auth/jwt"
import { route_jwt_authoriser } from "../../src/auth/route_authoriser";
import { api } from "../util";

const USERNAME = "binglethecoool";
const PASSWORD = "verybadpassword";
const EMAIL = "not@gmail.com";

//
const USER: DB_User =
{
    user_id: 0,
    user_name: USERNAME,
    user_email: EMAIL,
    user_password: "<hashed>>",
    user_verified: true,
    user_version: 1
}

let token = "";

beforeAll(async () =>
{
    const out = await fetch(api("/users"),
        {
            body: JSON.stringify(
                {
                    username: USERNAME,
                    email: EMAIL,
                    password: PASSWORD
                }),
            method: "POST",
            headers:
            {
                "Content-Type": "application/json"
            }
        });

    const json = await out.json();
    USER.user_id = json.user_id;

    console.log({ USER });
})

describe("creating and validating json web tokens", () =>
{

    it("should create a jwt", () =>
    {
        token = jwt_create_login_token(USER, 24);
    });

    it("should validate the generated jwt", () =>
    {
        const valid = jwt_verify_login_token(token);

        expect(valid).not.toBeUndefined();
        expect(valid?.user_id).toBe(USER.user_id);
    });

    it("should not validate invalid jwt", () =>
    {
        const valid = jwt_verify_login_token(token + "1");

        expect(valid).toBeUndefined();
    });
})

describe("endpoint authorizer checking jwt", () =>
{
    it("should accept the request", async () =>
    {
        // Fake header
        const request = { authorization: "Bearer " + token }

        const valid = await route_jwt_authoriser(request);
        expect(valid).toBeDefined();
        expect(valid?.user_id).toBe(USER.user_id)
    });
})