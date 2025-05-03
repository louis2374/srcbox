import compose from "docker-compose";
import { spawn } from "child_process"
import fs from "fs"
import path from "path";
const setup = async () =>
{
    try
    {
        console.log("\nLaunching db");
        await compose.upAll({ cwd: "../database" });

        // Launch server
        console.log("Launching server");

        // Have to keep it open for duration of the tests
        const serv = spawn('npm', ['run', 'start-test'],
            {
                cwd: path.resolve(__dirname, '../../backend'),
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
                await fetch("http://localhost:4000", { signal: AbortSignal.timeout(2000) });
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

