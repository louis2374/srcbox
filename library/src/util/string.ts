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