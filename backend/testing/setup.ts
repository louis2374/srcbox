import { configDotenv } from "dotenv";
import compose from "docker-compose";
import { exec, spawn } from "child_process"
import { api } from "./util";
import fs from "fs"

const setup = async () =>
{
    // Load env
    configDotenv({ path: ".env-tests" });

    try
    {
        console.log("\nLaunching db");
        await compose.upAll({ cwd: "../database" });

        // Launch server
        console.log("Launching server");

        // Have to keep it open for duration of the tests
        const serv = spawn('npm', ['run', 'start-test'],
            {
                detached: true,
                stdio: 'ignore',
                shell: true,
            });

        serv.on("error", (e) =>
        {
            console.log(e);
        })

        const pid = serv.pid;

        console.log({ pid });

        fs.writeFileSync("test_pid.temp", pid + "");

        // Wait until its up
        console.log("Waiting for server");

        let up = false;

        while (!up)
        {
            try
            {
                await fetch(api(), { signal: AbortSignal.timeout(2000) });
                up = true;
            }
            catch (e)
            {
                // Dont care 
            }
        }

        console.log("Dev server up");
    }
    catch (e)
    {
        console.error("Failed to launch db");
        process.exit(-1);
    }

    return;
}

export default setup;

