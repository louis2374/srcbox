import { api } from "../util";

const EMAIL = "bingus@gmail.com";
const PASSWORD = "bingus";
const USERNAME = "bingus";

export const testing_create_account_and_login = async (): string =>
{
    await fetch(api("/users"),
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

    return json.token;
}