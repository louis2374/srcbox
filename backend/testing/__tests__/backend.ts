import { Http } from "@srcbox/library";
import { api } from "../util";


// 
//
// All these tests have to be in one file, as jest does not allow me to define the order
// in which files are run. And most tests require the user register to have run for auth
//
// These tests are in a flow, as with my current setup, making each test self
// sufficient would be extremely slow to run, and write.
//
//

const EMAIL = "bingus@gmail.com";
const PASSWORD = "bingus";
const USERNAME = "bingus";
const TITLE = "cool_post";
const DESCRIPTION = "cool_description"
let token: string = "";
const HTML = `<div>hello</div><div id="bingus"></div>`;
const CSS = `div {background-color: red}`;
const JS = `document.getElementById("bingus").innerHTML = "world"`;
const COMMENT = "what a cool comment";
const COMMENT2 = "what a terrible comment";
const COMMENT3 = "what an insane comment";

describe("registration", () =>
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
                    "authorization": "Bearer " + token
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

        expect(out.status).toBe(Http.BAD_REQUEST);
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

        expect(out.status).toBe(Http.BAD_REQUEST);
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

        expect(out.status).toBe(Http.BAD_REQUEST);
    });
});

describe("authorization", () =>
{
    it("should accept valid login token", async () =>
    {
        const out = await fetch(api("/posts"),
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should not accept missing login token", async () =>
    {
        const out = await fetch(api("/posts"),
            {
                headers:
                {
                    "Content-Type": "application/json"
                }
            });

        expect(out.status).toBe(Http.UNAUTHORIZED);
    });

    it("should not accept invalid login token", async () =>
    {
        const out = await fetch(api("/posts"),
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + "abc123abc123abc123abc123"
                }
            });

        expect(out.status).toBe(Http.UNAUTHORIZED);
    });
})

describe("managing posts", () =>
{
    let upload_url: string;

    it("should create a post", async () =>
    {
        const out = await fetch(api("/posts"),
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        title: TITLE,
                        description: DESCRIPTION
                    }),
                headers:
                {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + token
                }
            });

        const json = await out.json();

        expect(out.status).toBe(Http.CREATED);
        expect(json.post_id).toBe(1);

        // Used in next test
        upload_url = json.upload_url;
    });

    it("should return an upload url", () =>
    {
        expect(upload_url).toBeTruthy();
    });

    it("should upload a posts code", async () =>
    {
        const code = JSON.stringify({ html: HTML, css: CSS, js: JS })

        const out = await fetch(upload_url,
            {
                method: "PUT",
                body: code,
            });

        expect(out.status).toBe(Http.OK);
    });

    let fetched_html: string, fetched_css: string, fetched_js: string;

    it("should fetch uploaded posts code", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/code"),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        const json = await out.json();
        fetched_css = json.css;
        fetched_html = json.html;
        fetched_js = json.js;

        expect(out.status).toBe(Http.OK);
    });

    it("should return original posts matching title and description", async () =>
    {
        const out = await fetch(api("/posts/" + 1),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        const json = await out.json();

        expect(out.status).toBe(Http.OK);
        expect(json.post_title).toBe(TITLE);
        expect(json.post_description).toBe(DESCRIPTION);
    });

    it("should match the original uploaded code", () =>
    {
        expect(fetched_html).toBe(HTML);
        expect(fetched_css).toBe(CSS);
        expect(fetched_js).toBe(JS);
    });

    it("should return not found for invalid id (code)", async () =>
    {
        const out = await fetch(api("/posts/" + 7654 + "/code"),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.NOT_FOUND);
    });

    it("should return not found for invalid id (post)", async () =>
    {
        const out = await fetch(api("/posts/" + 7654),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.NOT_FOUND);
    });

    it("should allow multiple posts", async () =>
    {
        const out = await fetch(api("/posts"),
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        title: TITLE,
                        description: DESCRIPTION
                    }),
                headers:
                {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + token
                }
            });

        const json = await out.json();

        expect(out.status).toBe(Http.CREATED);
        expect(json.post_id).toBe(2);

        // Used in next test
        upload_url = json.upload_url;
    });

    it("should accept delete request", async () => 
    {
        const out = await fetch(api("/posts/" + 2),
            {
                method: "DELETE",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should now be deleted", async () =>
    {
        const out = await fetch(api("/posts/" + 2),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.NOT_FOUND);
    })
});

describe("managing likes", () =>
{
    it("should accept the like request", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/like"),
            {
                method: "POST",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should be idempotent for liking (ignore duplicates, not change)", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/like"),
            {
                method: "POST",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should now have one like", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/likes"),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        const json = await out.json();

        expect(out.status).toBe(Http.OK);
        expect(json.likes).toBe(1);
    });

    it("should accept the unlike request", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/like"),
            {
                method: "DELETE",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should be idempotent for unliking", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/like"),
            {
                method: "DELETE",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should now have no likes", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/likes"),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        const json = await out.json();

        expect(out.status).toBe(Http.OK);
        expect(json.likes).toBe(0);
    });

    it("should not like an invalid post", async () =>
    {
        const out = await fetch(api("/posts/" + 1876 + "/like"),
            {
                method: "POST",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.NOT_FOUND);
    });

    it("should not unlike an invalid post", async () =>
    {
        const out = await fetch(api("/posts/" + 1876 + "/like"),
            {
                method: "DELETE",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.NOT_FOUND);
    });

    it("should not return likes for invalid post", async () =>
    {
        const out = await fetch(api("/posts/" + 1876 + "/likes"),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.NOT_FOUND);
    });
});

describe("managing comments", () =>
{
    it("should accept the comment request", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/comments"),
            {
                method: "POST",
                body: JSON.stringify({ text: COMMENT }),
                headers:
                {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should accept another comment request", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/comments"),
            {
                method: "POST",
                body: JSON.stringify({ text: COMMENT2 }),
                headers:
                {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should have two comments", async () =>
    {
        const out = await fetch(api("/posts/" + 1),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);

        const json = await out.json();

        expect(json.comment_count).toBe(2);
    });

    let comment_1: string, comment_2: string;

    it("should fetch the comments", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/comments"),
            {
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);

        const json = await out.json();

        comment_1 = json[0].comment_text;
        comment_2 = json[1].comment_text;
    });

    it("should match the original comments", async () =>
    {
        expect(comment_1).toBe(COMMENT);
        expect(comment_2).toBe(COMMENT2);
    });

    it("should not accept the comment request on invalid post", async () =>
    {
        const out = await fetch(api("/posts/" + 18769 + "/comments"),
            {
                method: "POST",
                body: JSON.stringify({ text: COMMENT }),
                headers:
                {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.NOT_FOUND);
    });

    it("accept comment delete request", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/comments/" + 1),
            {
                method: "DELETE",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);
    });

    it("should only have one comment left", async () =>
    {
        const out = await fetch(api("/posts/" + 1),
            {
                method: "GET",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);

        const json = await out.json();

        expect(json.comment_count).toBe(1);
    });

    it("should accept the patch request", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/comments/" + 2),
            {
                method: "PATCH",
                body: JSON.stringify({ text: COMMENT3 }),
                headers:
                {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + token
                }
            });

        const json = await out.json();

        expect(out.status).toBe(Http.OK);
    });

    it("should now have updated the comment", async () =>
    {
        const out = await fetch(api("/posts/" + 1 + "/comments"),
            {
                method: "GET",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);

        const json = await out.json();

        expect(json[0].comment_text).toBe(COMMENT3);
    });
});

describe("managing follows", () =>
{
    it("should accept the follow request", async () =>
    {
        const out = await fetch(api("/users/" + 1 + "/follow"),
            {
                method: "POST",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK)
    });

    it("should have one follower", async () =>
    {
        const out = await fetch(api("/users/" + 1 + "/follows"),
            {
                method: "GET",
                headers:
                {
                    "authorization": "Bearer " + token
                }
            });

        expect(out.status).toBe(Http.OK);


        const json = await out.json();

        expect(json.follows).toBe(1);

    });
})