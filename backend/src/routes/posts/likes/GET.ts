import { docroute } from "../../../router/route_builder";

export default docroute()
    .summary("Example endpoint")
    .parameter("url", "test", "string", true)
    .parameter("url", "bingus", "number", true)
    .handler<{ url: { test: string } }>((req, res, { url: { test } }) =>
    {
        console.log("ROUTE DONE")
        res.json({ "HELLO": "BINGUS", path: test });
    }).build();
