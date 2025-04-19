import { configDotenv } from "dotenv";
configDotenv();

import { db_con } from "./connection";
import fs from "fs";

const init = fs.readFileSync("../database/init/init.sql", "utf-8");

db_con.raw(init).then(() => console.log("Database created")).catch(console.error);