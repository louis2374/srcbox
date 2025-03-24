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