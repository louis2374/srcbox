// Basic vfs
// May turn into a real vfs later

interface FS
{
    read: (p_path: string) => string | undefined,
    write: (p_path: string, p_data: string) => void
}

// I need to make this save to local storage, was thinking about using indexDB
const filesystem = (): FS =>
{
    const files = new Map<string, string>();

    // Not really a proper path system.
    // Just assigning files to a full path, as a key
    const write_file = (p_path: string, p_data: string) =>
    {
        if (!p_path) throw new Error("Cannot write to invalid path");

        files.set(p_path, p_data);
    }

    const read_file = files.get

    return {
        read: read_file,
        write: write_file
    }

}