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
}

export default exit;

