import { Http } from "@srcbox/library";
import { api } from "../util";

const EMAIL = "bingus@gmail.com";
const PASSWORD = "bingus";
const USERNAME = "bingus";

describe("user register flow", () =>
{
    it("should create an account", async () =>
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

        expect(json.user_id).toBe(1)

        expect(out.ok).toBeTruthy();
    });

    let token = "";

    it("should return login token", async () =>
    {
        const out = await fetch(api("/auth/login"),
            {
                body: JSON.stringify(
                    {
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

        token = json.token;

        expect(token).toBeTruthy();
    });

    it("should accept the login token", async () =>
    {
        const out = await fetch(api("/users/1"),
            {
                method: "GET",
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });

        const json = await out.json();

        expect(out.ok).toBeTruthy();

        expect(json.user_id).toBe(1)
    });
})

describe("registration validation", () =>
{
    it("should not create an account with duplicate email", async () =>
    {
        const out = await fetch(api("/users"),
            {
                body: JSON.stringify(
                    {
                        username: USERNAME + "_",
                        email: EMAIL,
                        password: PASSWORD
                    }),
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.CONFLICT);
    });

    it("should not create an account with duplicate username", async () =>
    {
        const out = await fetch(api("/users"),
            {
                body: JSON.stringify(
                    {
                        username: USERNAME,
                        email: EMAIL + "_",
                        password: PASSWORD
                    }),
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.CONFLICT);
    });

    it("should not create an account with no username", async () =>
    {
        const out = await fetch(api("/users"),
            {
                body: JSON.stringify(
                    {
                        username: "",
                        email: EMAIL + "_",
                        password: PASSWORD
                    }),
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                }
            });
        console.log(out.status)

        expect(out.status).toBe(Http.BAD_REQUEST);
    });

    it("should not create an account with no email", async () =>
    {
        const out = await fetch(api("/users"),
            {
                body: JSON.stringify(
                    {
                        username: USERNAME + "_",
                        email: "",
                        password: PASSWORD
                    }),
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                }
            });
        console.log(out.status)

        expect(out.status).toBe(Http.BAD_REQUEST);
    });

    it("should not create an account with no password", async () =>
    {
        const out = await fetch(api("/users"),
            {
                body: JSON.stringify(
                    {
                        username: USERNAME + "_",
                        email: EMAIL + "_",
                        password: ""
                    }),
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        console.log(out.status)
        expect(out.status).toBe(Http.CONFLICT);
    });
});

describe("credential validation", () =>
{
    it("should not authorize invalid password", async () =>
    {
        const out = await fetch(api("/auth/login"),
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        email: EMAIL,
                        password: PASSWORD + "_" // Password will always be wrong as I append _ to it
                    }),
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.UNAUTHORIZED);
    });

    it("should return bad request on missing password", async () =>
    {
        const out = await fetch(api("/auth/login"),
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        email: EMAIL
                    }),
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.BAD_REQUEST);
    });

    it("should return bad request on missing email", async () =>
    {
        const out = await fetch(api("/auth/login"),
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        password: PASSWORD
                    }),
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.BAD_REQUEST);
    });

    it("should not authorize wrong email", async () =>
    {
        const out = await fetch(api("/auth/login"),
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        email: EMAIL + "_",
                        password: PASSWORD
                    }),
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.UNAUTHORIZED);
    });

    it("should not authorize empty email", async () =>
    {
        const out = await fetch(api("/auth/login"),
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        email: "",
                        password: PASSWORD
                    }),
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.UNAUTHORIZED);
    });

    it("should not authorize empty password", async () =>
    {
        const out = await fetch(api("/auth/login"),
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        email: EMAIL,
                        password: ""
                    }),
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.UNAUTHORIZED);
    });
})