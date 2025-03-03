export const join = (...p_classes: Array<string | undefined | false>) =>
{
    return p_classes
        .filter((c): c is string => typeof c === 'string' && c.length > 1)
        .map(c => c.trim())
        .join(" ");
}