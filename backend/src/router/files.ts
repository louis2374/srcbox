import path from "path";
import fs from "fs";

export const get_all_files = (p_path: string): Array<string> =>
{
    // Get all files/dirs, and convert to abs path
    const all: Array<string> = fs.readdirSync(p_path).map(f => path.join(p_path, f));

    // Output arr
    const files: Array<string> = [];

    all.forEach(f =>
    {
        // Add directory contents recursively
        if (fs.lstatSync(f).isDirectory()) files.push(...get_all_files(f));
        else files.push(f);
    });

    return files;
}

