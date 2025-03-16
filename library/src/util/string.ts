import { Char } from "../typing/string";

export const count_chars = (p_string: string, p_char: string): number =>
{
    // If non char was given
    if (p_char.length !== 1) return 0;

    // Count them
    let count = 0;
    for (let i = 0; i < p_string.length; i++)
    {
        if (p_string[i] === p_char) count++;
    }

    return count;
}

export const capitalise = (p_string: string): string =>
{
    if (p_string.length === 0) return p_string;

    return p_string[0].toUpperCase() + p_string.slice(1);
}

export const is_valid_email = (p_email: string) =>
{
    // From a quick google search
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(p_email)
}

export const is_sufficient_password = (p_password: string) =>
{
    // STACK OVERFLOW
    return /^(?=.*[A-Za-z])(?=.*[^A-Za-z]).{9,}$/.test(p_password)
}