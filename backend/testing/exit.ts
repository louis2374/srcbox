import { spawn } from "child_process";
import compose from "docker-compose";
import fs from "fs";
import ps_tree from "ps-tree";

const exit = async () =>
{
    console.log("Shutting db");
    // Close temp postgres server
    await compose.downAll({ cwd: "../database" });
    console.log("Db shut down");

    console.log("Shutting down server")
    const pid = fs.readFileSync("test_pid.temp", "utf-8");
    console.log({ pid })
    fs.rmSync("test_pid.temp")

    // I spent too long trying to make it automatically close the server.
    // I may come back to this but for now it will have to be manually closed

    // The process would hang unless I did this. Its pretty bad but its fine, all tests have already
    // been run at this point
    process.exit(0);
}

export default exit;

