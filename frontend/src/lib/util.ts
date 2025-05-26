const num_formatter = new Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' });

export const readable_i = (p_num: number) =>
{
    return num_formatter.format(p_num);
}

// Can call a func multiple times, which resets the time. The func is only invoked
// after it has not been called for p_delay ms
export const debounce = (p_func: () => void, p_delay: number) =>
{
    let timeout: NodeJS.Timeout;
    return () =>
    {
        // Deleting existing timeout if it exists
        if (timeout) clearTimeout(timeout);

        // Create the new timeout
        timeout = setTimeout(p_func, p_delay);
    }
}

// Decode b64
export const b64_decode = (p_b64: string) =>
{
    const buf = Buffer.from(p_b64, "base64");
    return buf.toString("utf-8");
}

// Decode jwt locally. This is not checking the jwt is valid, and is purely for getting user id
export const local_user_id_get = (token: string) =>
{
    // Token is in 3 parts, i want the middle
    const str = b64_decode(token);

    // Regex extract {} pairs, i want the second
    const parts = str.match(/[{].*?[}]/g)

    if (!parts || parts.length < 2) throw new Error("Failed to decode local user");

    const parsed = JSON.parse(parts[1]);

    if (parsed.sub == undefined) throw new Error("Failed to decode local user")

    return parsed.sub;
}