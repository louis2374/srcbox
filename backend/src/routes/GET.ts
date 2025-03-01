import { docroute } from "../router/route_builder";

export default docroute()
    .summary("Example endpoint")
    .parameter("path", "test", "string", true)
    .handler<{ path: { id: string } }>((req, res, { path }) =>
    {
        console.log("ROUTE DONE")
        res.json({ "HELLO": "BINGUS" });
    }).build();